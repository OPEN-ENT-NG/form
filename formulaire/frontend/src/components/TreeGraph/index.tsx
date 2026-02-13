/* eslint-disable */
import { useEffect, useRef } from "react";
import * as d3 from "d3";
import * as dagreD3 from "dagre-d3";
import { IForm } from "~/core/models/form/types";
import { IFormElement } from "~/core/models/formElement/types";
import { IQuestion, IQuestionChoice } from "~/core/models/question/types";
import { isQuestion, isSection } from "~/core/models/formElement/utils";
import { getFollowingFormElement } from "~/providers/CreationProvider/utils";
import { getNextFormElement as getNextFormElementSection } from "~/core/models/section/utils";
import { getNextFormElement as getNextFormElementQuestion } from "~/core/models/question/utils";
import { t } from "~/i18n";
import { displayTypeIcon, intersects, shuffle } from "./utils";
import "./tree.scss";

interface FormTreeViewProps {
  form: IForm;
  formElements: IFormElement[];
}

interface Line {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
}

interface Arrow {
  lines: Line[];
}

export const FormTreeView = ({ form, formElements }: FormTreeViewProps) => {
  const mainGraphRef = useRef<any>(null);

  useEffect(() => {
    if (formElements.length === 0) return;
    initD3Dagre();

    const handleResize = () => {
      const svg = d3.select("#tree-svg");
      const zoom = d3.zoom().on("zoom", (e: any) => {
        svg.select("g").attr("transform", e.transform);
      });
      centerGraph(svg, zoom);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [formElements]);

  const centerGraph = (svg: any, zoom: d3.ZoomBehavior<Element, unknown>): void => {
    const treeView = d3.select(".tree-view");
    const treeViewWidth = treeView.node()?.offsetWidth ?? 0;
    const vh = window.innerHeight - (window.innerHeight * 25) / 100;
    const initialScale = 0.75;
    svg.attr("width", treeViewWidth).attr("height", vh);
    if (mainGraphRef.current != null) {
      svg.call(
        zoom.transform,
        d3.zoomIdentity
          .translate((svg.attr("width") - mainGraphRef.current.graph().width * initialScale) / 2, 20)
          .scale(initialScale),
      );
    }
  };

  const initD3Dagre = (): void => {
    const nodes = initNodes();
    const edgeList = initEdgeList();
    const render = new dagreD3.render();
    const svg = d3.select("#tree-svg");
    const inner = svg.select("g");

    const zoom = d3.zoom().on("zoom", (e: any) => {
      inner.attr("transform", e.transform);
    });
    svg.call(zoom);

    render_graph(render, nodes, edgeList, inner, svg);
    centerGraph(svg, zoom);
  };

  const setTreeNodeLabel = (element: IFormElement): string => {
    let label = element.title ?? "";
    if (element.id && isSection(element)) {
      const questions = element.questions ?? [];
      if (questions.length > 0) label += "\n";
      for (const question of questions) {
        label += "\n- " + question.title;
      }
    }
    return label;
  };

  const initNodes = (): any[] => {
    const recapElement = {
      id: 0,
      form_id: form.id,
      title: t("formulaire.end.form"),
    };
    const allElements = [...formElements, recapElement as unknown as IFormElement];
    for (const el of allElements) {
      setTreeNodeLabel(el);
    }
    return allElements;
  };

  const initEdgeList = (): any[] => {
    const formElementLinks: any[] = [];
    for (const formElement of formElements) {
      if (isSection(formElement)) {
        const conditionalQuestion = formElement.questions.find((question: IQuestion) => question.conditional);
        if (conditionalQuestion) {
          addChoicesLink(formElement, conditionalQuestion.choices ?? [], formElementLinks);
        } else {
          const nextFormElementId = getNextFormElementSection(formElement, formElements)?.id;
          addFormElementLink(formElement.id ?? 0, nextFormElementId ?? 0, formElementLinks);
        }
      } else if (isQuestion(formElement) && formElement.conditional) {
        addChoicesLink(formElement, formElement.choices ?? [], formElementLinks);
      } else {
        const nextFormElementId = getFollowingFormElement(formElement, formElements)?.id;
        addFormElementLink(formElement.id ?? 0, nextFormElementId ?? 0, formElementLinks);
      }
    }
    return formElementLinks;
  };

  const addFormElementLink = (formElementId: number, nextFormElementId: number, formElementLinks: any[]): void => {
    formElementLinks.push([`${formElementId}`, `${nextFormElementId}`, { label: "" }]);
  };

  const addChoicesLink = (formElement: IFormElement, choices: IQuestionChoice[], formElementLinks: any[]): void => {
    for (const choice of choices) {
      const nextFormElementId = getNextFormElementQuestion(choice, formElements)?.id;
      addFormElementLink(formElement.id ?? 0, nextFormElementId || 0, formElementLinks);
    }
  };

  const countNbCollisions = (arrows: Arrow[]): number => {
    let collisionCnt = 0;
    for (const arrow of arrows) {
      collisionCnt += arrows.filter((a) => a !== arrow && arrowsIntersect(arrow, a)).length;
    }
    return collisionCnt;
  };

  const arrowsIntersect = (arrowA: Arrow, arrowB: Arrow): boolean => {
    for (const lineA of arrowA.lines) {
      for (const lineB of arrowB.lines) {
        if (linesIntersect(lineA, lineB)) return true;
      }
    }
    return false;
  };

  const linesIntersect = (a: Line, b: Line): boolean => {
    return intersects(a.startX, a.startY, a.endX, a.endY, b.startX, b.startY, b.endX, b.endY);
  };

  const render_graph = (render: any, nodes: any[], edgeList: any[], inner: any, svg: any): void => {
    let nbTries = 100;
    let iter_cnt = 0;
    let optimalArray: any[] | undefined;
    let best_result: number | undefined;

    while (nbTries--) {
      const list = shuffle(edgeList);
      if (!optimalArray) optimalArray = list;
      setNodesAndEdges(nodes, edgeList, render, inner);
      const arrows = extractArrows(svg);
      const collisionArrowsCnt = countNbCollisions(arrows);

      if (collisionArrowsCnt === 0) {
        optimalArray = list.slice();
        break;
      }
      if (iter_cnt === 0) best_result = collisionArrowsCnt;
      if (collisionArrowsCnt < best_result!) {
        best_result = collisionArrowsCnt;
        optimalArray = list.slice();
      }
      iter_cnt++;
    }

    setNodesAndEdges(nodes, optimalArray ?? edgeList, render, inner);
  };

  const setNodesAndEdges = (nodes: any[], edges: any[], render: any, inner: any): void => {
    const g = new dagreD3.graphlib.Graph().setGraph({});
    for (const node of nodes) {
      g.setNode(node.id, { labelType: "html", label: getHtmlNode(node) });
    }
    for (const edge of edges) {
      g.setEdge.apply(g, edge);
    }
    g.graph().rankdir = "TB";
    g.graph().nodesep = 60;
    mainGraphRef.current = g;
    render(inner, g);
  };

  const extractArrows = (svg: any): Arrow[] => {
    const nn = svg.select(".edgePaths");
    const paths = nn.node();
    let fc = paths.firstChild;
    const arrows: Arrow[] = [];

    while (fc) {
      const path = fc.firstChild.getAttribute("d");
      const coords = path.split(/,|L/).map((c: string) => {
        const n = c[0] === "M" || c[0] === "L" ? c.substring(1) : c;
        return parseFloat(n);
      });

      const lines: Line[] = [];
      for (let i = 0; i <= coords.length - 4; i += 2) {
        lines.push({ startX: coords[i], startY: coords[i + 1], endX: coords[i + 2], endY: coords[i + 3] });
      }
      arrows.push({ lines });
      fc = fc.nextSibling;
    }
    return arrows;
  };

  const getHtmlNode = (formElement: IFormElement): string => {
    if (isQuestion(formElement)) {
      return `<div class="tree-view-question">
                <img src="${displayTypeIcon(formElement.questionType)}"/>
                <div class="title ellipsis">${formElement.title}</div>
              </div>`;
    } else if (isSection(formElement)) {
      return `<div class="tree-view-section">
                <div class="top twelve">
                  <span class="title ellipsis">${formElement.title}</span>
                </div>
                <div class="main twelve">
                  ${formElement.questions.map((q: IQuestion) => getHtmlNode(q)).join("")}
                </div>
              </div>`;
    } else {
      return `<div class="tree-view-section">
                <div class="top no-main twelve">
                  <span class="title ellipsis">${formElement.title}</span>
                </div>
              </div>`;
    }
  };

  // --- Rendu JSX ---
  if (formElements.length === 0) return null;

  return (
    <div className="tree-view">
      <svg width="100%" id="tree-svg">
        <g />
      </svg>
    </div>
  );
};
