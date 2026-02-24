/* eslint-disable */
import { useEffect, useRef, forwardRef, useImperativeHandle, useCallback } from "react";
import * as d3 from "d3";
import * as dagreD3 from "dagre-d3";
import { IFormElement } from "~/core/models/formElement/types";
import { IQuestion, IQuestionChoice } from "~/core/models/question/types";
import { isQuestion, isSection } from "~/core/models/formElement/utils";
import { getFollowingFormElement } from "~/providers/CreationProvider/utils";
import { getNextFormElement as getNextFormElementSection } from "~/core/models/section/utils";
import { getNextFormElement as getNextFormElementQuestion } from "~/core/models/question/utils";
import { t } from "~/i18n";
import { displayTypeIcon, intersects, shuffle } from "./utils";
import "./tree.scss";
import { IArrow, IFormTreeViewHandle, IFormTreeViewProps, ILine } from "./types";
import { INITIAL_TREE_SCALE } from "~/core/constants";

const getEditIcon = (id: number): string =>
  `<svg class="tree-edit-icon" data-element-id="${id}" focusable="false" viewBox="0 0 24 24" style="width:20.5px;height:19.5px;fill:currentColor;opacity:0.5;cursor:pointer;flex-shrink:0;margin-left:auto;margin-right:8px;outline:none;border:none;">
    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
  </svg>`;

export const FormTreeView = forwardRef<IFormTreeViewHandle, IFormTreeViewProps>(
  ({ form, formElements, onZoomChange, onEditElement }, ref) => {
    const mainGraphRef = useRef<any>(null);
    const zoomRef = useRef<d3.ZoomBehavior<Element, unknown> | null>(null);
    const svgRef = useRef<any>(null);
    const innerRef = useRef<any>(null);

    const zoomTo = useCallback((scale: number) => {
      const svg = svgRef.current;
      const zoom = zoomRef.current;
      if (!svg || !zoom || !mainGraphRef.current) return;

      const width = parseFloat(svg.attr("width"));
      const height = parseFloat(svg.attr("height"));
      const currentTransform = d3.zoomTransform(svg.node());
      const newScale = scale / 100;

      const cx = (width / 2 - currentTransform.x) / currentTransform.k;
      const cy = (height / 2 - currentTransform.y) / currentTransform.k;

      const newTx = width / 2 - cx * newScale;
      const newTy = height / 2 - cy * newScale;

      svg.transition().duration(300).call(zoom.transform, d3.zoomIdentity.translate(newTx, newTy).scale(newScale));
    }, []);

    useImperativeHandle(ref, () => ({ zoomTo }), [zoomTo]);

    const isInitializedRef = useRef(false);

    useEffect(() => {
      if (formElements.length === 0) return;

      const isFirstInit = !isInitializedRef.current;
      isInitializedRef.current = true;

      initD3Dagre(isFirstInit);

      const handleResize = () => {
        const svg = d3.select("#tree-svg");
        const zoom = d3.zoom().on("zoom", (e: any) => {
          innerRef.current?.attr("transform", e.transform);
          onZoomChange?.(Math.round(e.transform.k * 100));
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
      const initialScale = INITIAL_TREE_SCALE / 100;
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

    const initD3Dagre = (shouldCenter: boolean): void => {
      const nodes = initNodes();
      const edgeList = initEdgeList();
      const render = new dagreD3.render();
      const svg = d3.select("#tree-svg");
      const inner = svg.select("g");

      const zoom = d3.zoom().on("zoom", (e: any) => {
        inner.attr("transform", e.transform);
        onZoomChange?.(Math.round(e.transform.k * 100));
      });
      svg.call(zoom);

      zoomRef.current = zoom;
      svgRef.current = svg;
      innerRef.current = inner;

      render_graph(render, nodes, edgeList, inner, svg);

      if (shouldCenter) {
        centerGraph(svg, zoom);
      }

      svg.on("click", (event: MouseEvent) => {
        const target = event.target as Element;
        const iconEl = target.closest(".tree-edit-icon");
        if (!iconEl) return;

        event.stopPropagation();

        const elementId = iconEl.getAttribute("data-element-id");
        // Cherche dans formElements ET dans les questions des sections
        const allElements: IFormElement[] = formElements.flatMap((el) =>
          isSection(el) ? [el, ...(el.questions as unknown as IFormElement[])] : [el],
        );
        const formElement = allElements.find((el) => String(el.id) === elementId);
        if (formElement) {
          onEditElement?.(formElement);
        }
      });
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
            addChoicesLink(formElement, conditionalQuestion.choices ?? [], formElementLinks, conditionalQuestion);
          } else {
            const nextFormElementId = getNextFormElementSection(formElement, formElements)?.id;
            addFormElementLink(formElement.id ?? 0, nextFormElementId ?? 0, formElementLinks);
          }
        } else if (isQuestion(formElement) && formElement.conditional) {
          addChoicesLink(formElement, formElement.choices ?? [], formElementLinks, formElement);
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

    const addChoicesLink = (
      formElement: IFormElement,
      choices: IQuestionChoice[],
      formElementLinks: any[],
      parentQuestion?: IQuestion,
    ): void => {
      for (const choice of choices) {
        const nextFormElementId = getNextFormElementQuestion(choice, formElements, parentQuestion)?.id;
        addFormElementLink(formElement.id ?? 0, nextFormElementId || 0, formElementLinks);
      }
    };

    const countNbCollisions = (arrows: IArrow[]): number => {
      let collisionCnt = 0;
      for (const arrow of arrows) {
        collisionCnt += arrows.filter((a) => a !== arrow && arrowsIntersect(arrow, a)).length;
      }
      return collisionCnt;
    };

    const arrowsIntersect = (arrowA: IArrow, arrowB: IArrow): boolean => {
      for (const lineA of arrowA.lines) {
        for (const lineB of arrowB.lines) {
          if (linesIntersect(lineA, lineB)) return true;
        }
      }
      return false;
    };

    const linesIntersect = (a: ILine, b: ILine): boolean => {
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

    const extractArrows = (svg: any): IArrow[] => {
      const nn = svg.select(".edgePaths");
      const paths = nn.node();
      let fc = paths.firstChild;
      const arrows: IArrow[] = [];

      while (fc) {
        const path = fc.firstChild.getAttribute("d");
        const coords = path.split(/,|L/).map((c: string) => {
          const n = c[0] === "M" || c[0] === "L" ? c.substring(1) : c;
          return parseFloat(n);
        });

        const lines: ILine[] = [];
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
        return `<div class="tree-view-question" style="display:flex;align-items:center;">
                <img src="${displayTypeIcon(formElement.questionType)}"/>
                <div class="title ellipsis" style="flex:1;min-width:0;">${formElement.title}</div>
                ${getEditIcon(formElement.id ?? 0)}
              </div>`;
      } else if (isSection(formElement)) {
        return `<div class="tree-view-section">
                <div class="top twelve" style="display:flex;align-items:center;">
                  <span class="title ellipsis" style="flex:1;min-width:0;margin-left:8px;">${formElement.title}</span>
                  ${getEditIcon(formElement.id ?? 0)}
                </div>
                <div class="main twelve">
                  ${formElement.questions.map((q: IQuestion) => getHtmlNode(q)).join("")}
                </div>
              </div>`;
      } else {
        return `<div class="tree-view-section">
                <div class="top no-main twelve" style="display:flex;align-items:center;">
                  <span class="title ellipsis" style="flex:1;min-width:0;">${formElement.title}</span>
                  ${getEditIcon(formElement.id ?? 0)}
                </div>
              </div>`;
      }
    };

    if (formElements.length === 0) return null;

    return (
      <div className="tree-view">
        <svg width="100%" id="tree-svg">
          <g />
        </svg>
      </div>
    );
  },
);
