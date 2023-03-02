import {idiom, idiom as lang} from 'entcore';
import {Question, QuestionChoice, Response, Types} from "@common/models";
import {ColorUtils} from "@common/utils/color";
import * as ApexCharts from 'apexcharts';
import 'core-js/es7/object';

export class GraphUtils {

    // Results page
    /**
     * Generate data, options and render graph of the results of a question according to its type (for result page view)
     * @param question    Question object which we want to display the results
     * @param responses   Array of responses which we want to display the results
     * @param isExportPDF Boolean to determine if we generate a graph for result or for PDF Export
     * @param charts      ApexCharts to store and render at the end
     * @param distribs  Distrib's number for each question
     */
    static generateGraphForResult = async (question: Question, charts: ApexChart[], responses: Response[],
                                           distribs: number, isExportPDF: boolean) : Promise<void> => {
        switch (question.question_type) {
            case Types.SINGLEANSWER:
            case Types.SINGLEANSWERRADIO:
                await GraphUtils.generateSingleAnswerChart(question, charts, isExportPDF);
                break;
            case Types.MULTIPLEANSWER:
                await GraphUtils.generateMultipleAnswerChart(question, charts, distribs, isExportPDF);
                break;
            case Types.MATRIX:
                await GraphUtils.generateMatrixChart(question, charts, isExportPDF);
                break;
            case Types.CURSOR:
                await GraphUtils.generateCursorChart(question, charts, responses, isExportPDF);
                break;
            case Types.RANKING:
                await GraphUtils.generateRankingChart(question, charts, responses, isExportPDF);
                break;
            default:
                break;
        }
    };

    /**
     * Generate and render graph of the results of a single answer question
     * @param question    Question object which we want to display the results
     * @param charts      ApexChart to render at the end
     * @param isExportPDF Boolean to determine if we generate a graph for result or for PDF Export
     */
    private static generateSingleAnswerChart = async (question: Question, charts: ApexChart[], isExportPDF: boolean) : Promise<void> => {
        let choices: QuestionChoice[] = question.choices.all.filter((c: QuestionChoice) => c.nbResponses > 0);

        let series: number[] = [];
        let labels: string[] = [];
        let i18nValue: string = idiom.translate('formulaire.response');
        i18nValue = i18nValue.charAt(0).toUpperCase() + i18nValue.slice(1);

        for (let choice of choices) {
            series.push(choice.nbResponses); // Fill data
            let index: number = question.choices.all.indexOf(choice) + 1;
            !choice.id ? labels.push(idiom.translate('formulaire.response.empty')) : labels.push(i18nValue + " " + index); // Fill labels
        }

        // Generate options with labels and colors
        let baseHeight: number = 40 * question.choices.all.length;
        let height: number = baseHeight < 200 ? 200 : (baseHeight > 500 ? 500 : baseHeight);

        let colors: string[] = ColorUtils.generateColorList(labels.length);

        let newOptions: any = isExportPDF ?
            GraphUtils.generateOptions(question.question_type, colors, labels)
            :
            GraphUtils.generateOptions(question.question_type, colors, labels, height, '100%');

        newOptions.series = series;

        await GraphUtils.renderChartForResult(newOptions, charts, question, isExportPDF);
    };

    /**
     * Generate and render graph of the results of a matrix question
     * @param question  Question object which we want to display the results
     * @param charts     ApexChart to render at the end
     * @param isExportPDF Boolean to determine if we generate a graph for result or for PDF Export
     */
    private static generateMatrixChart = async (question: Question, charts: ApexChart[], isExportPDF: boolean) : Promise<void> => {
        let choices: QuestionChoice[] = question.choices.all;

        let series: any[] = [];
        let labels: string[] = question.children.all.map((child: Question) => child.title);

        for (let choice of choices) {
            let serie: any = {
                name: choice.value,
                data: []
            };

            // Fill serie data with nb responses of this choice for this child question
            for (let child of question.children.all) {
                let matchingChoice: QuestionChoice[] = child.choices.all.filter((c: QuestionChoice) => c.value === choice.value);
                serie.data.push(matchingChoice.length == 1 ? matchingChoice[0].nbResponses : 0);
            }

            series.push(serie); // Fill series
        }

        // Generate options with labels and colors
        let colors: string[] = ColorUtils.generateColorList(series.length);

        let newOptions: any = isExportPDF ?
            GraphUtils.generateOptions(question.question_type, colors, labels, null, null)
            :
            GraphUtils.generateOptions(question.question_type, colors, labels, '100%', '100%');

        newOptions.series = series;

        await GraphUtils.renderChartForResult(newOptions, charts, question, isExportPDF);
    };

    /**
     * Generate and render graph of the results of a cursor question
     * @param question    Question object which we want to display the results
     * @param charts      ApexChart to render at the end
     * @param responses   Array of responses which we want to display the results
     * @param isExportPDF Boolean to determine if we generate a graph for result or for PDF Export
     */
    private static generateCursorChart = async (question: Question, charts: ApexChart[], responses: Response[],
                                                isExportPDF: boolean) : Promise<void> => {
        // build array with all response
        let resp: number[] = responses.map((r: Response) => Number(r.answer)).sort((a: number, b: number) => a - b);
        let cursorAverage: string = (resp.reduce((a: number, b: number) => a + b, 0) / resp.length).toFixed(2);

        // map to build object with response and number of each one
        const map: Map<number, number> = resp.reduce((acc: Map<number, number>, e: number) =>
            acc.set(e, (acc.get(e) || 0) + 1), new Map());

        let labels: number[] = Array.from(map.keys());
        let colors: string[] = ColorUtils.generateColorList(labels.length);

        let newPDFOptions: any = isExportPDF ?
            GraphUtils.generateOptions(question.question_type, colors, labels,
            null, null, null, cursorAverage)
            :
            GraphUtils.generateOptions(question.question_type, colors, labels,
            '100%', '100%', null, cursorAverage);

        newPDFOptions.series = [{ name: lang.translate('formulaire.nb.responses'), data: Array.from(map.values()) }];

        await GraphUtils.renderChartForResult(newPDFOptions, charts, question, isExportPDF);
    }

    /**
     * Generate and render graph of the results of a ranking's question
     * @param question    Question object which we want to display the results
     * @param charts      ApexChart to render at the end
     * @param responses   Array of responses which we want to display the results
     * @param isExportPDF Boolean to determine if we generate a graph for result or for PDF Export
     */
    private static generateRankingChart = async (question: Question, charts: ApexChart[], responses: Response[],
                                                isExportPDF: boolean) : Promise<void> => {
        let choices: QuestionChoice[] = question.choices.all.filter((c: QuestionChoice) => c.nbResponses > 0);
        let series: any = [];
        let labels: string[] = [];
        let answerChoice: Array<string> = new Array<string>;
        let colors: string[] = ColorUtils.generateColorList(labels.length);
        let posChoice: Array<number> = new Array<number>();

        const uniqueLabels: any = new Set();
        for (let resp of responses) {
            if (!uniqueLabels.has(resp.choice_position)) {
                labels.push(resp.choice_position.toString());
                uniqueLabels.add(resp.choice_position);
            }
        }

        const uniqueChoices = new Set();
        for (let choice of choices) {
            const value = choice.value;
            if (!uniqueChoices.has(value)) {
                answerChoice.push(value);
                uniqueChoices.add(value);
            }
        }

        // Build 2 arrays with position & answer
        for (let j = 0; j < responses.length; j ++) {
            posChoice.push(responses[j].choice_position)
            // answerChoice.push(<string>responses[j].answer)
        }

        const answerPosition = posChoice.map((key: number, index: number) => {
            return { [key]: answerChoice[index] };
        });

        // Count how many times each value was at one position
        const count = answerPosition.reduce((acc: {[p: number]: string}, currentObject: {[p: number]: string}) => {
            const [key, value] = Object.entries(currentObject)[0];
            if (!acc[key]) {
                acc[key] = {};
            }
            if (!acc[key][value]) {
                acc[key][value] = 1;
            } else {
                acc[key][value] += 1;
            }
            // Initialize count for all other values to 0
            Object.keys(acc).forEach(k => {
                if (k !== key) {
                    if (!acc[k][value]) {
                        acc[k][value] = 0;
                    }
                }
            });
            return acc;
        }, {});

        const label = Object.keys(count);
        for (const choice of Object.keys(count[label[0]])) {
            const values = [];
            for (const l of label) {
                values.push(count[l][choice]);
            }
            series.push({
                data: values
            });
        }
        console.log(series);

        let newOptions: any = isExportPDF ?
            GraphUtils.generateOptions(question.question_type, colors, labels,
                null, null, null, null)
            :
            GraphUtils.generateOptions(question.question_type, colors, labels,
                '100%', '100%', null, null, answerChoice);

        newOptions.series = series;
        await GraphUtils.renderChartForResult(newOptions, charts, question, isExportPDF);
    }

    /**
     * Generate and render graph of the results of a multiple answers question
     * @param question    Question object which we want to display the results
     * @param charts      ApexCharts to store and render at the end
     * @param distribs    Distrib's number for each question
     * @param isExportPDF Boolean to identify if it's a PDF export case
     */
    static generateMultipleAnswerChart = async (question: Question, charts: ApexChart[], distribs: number, isExportPDF: boolean) : Promise<void> => {
        if (question.question_type != Types.MULTIPLEANSWER) {
            return null;
        }

        let choices: QuestionChoice[] = question.choices.all;

        let series: number[] = [];
        let labels: string[] = [];
        let seriesPercent: number[] = [];

        for (let choice of choices) {
            series.push(choice.nbResponses); // Fill data
            // Fill labels
            !choice.id ?
                labels.push(idiom.translate('formulaire.response.empty')) :
                labels.push(choice.value.substring(0, 40) + (choice.value.length > 40 ? "..." : ""))
            seriesPercent.push((choice.nbResponses/distribs)*100)
        }

        let colors: string[] = ColorUtils.generateColorList(labels.length);
        let newOptions: any = GraphUtils.generateOptions(question.question_type, colors, labels, null, null,
            seriesPercent);
        newOptions.series = [{ data: series }];

        await GraphUtils.renderChartForResult(newOptions, charts, question, isExportPDF);
    }

    /**
     * Render graph with ApexChart based on given options
     * @param options     ApexChart options to render the graph
     * @param charts      ApexCharts to store and render at the end
     * @param question    Question object which we want to display the results
     * @param isExportPDF Boolean to identify if it's a PDF export case
     */
    static renderChartForResult = async (options: any, charts: any, question: Question, isExportPDF: boolean) : Promise<void> => {
        if (isExportPDF) {
            charts.push(new ApexCharts(document.querySelector(`#pdf-response-chart-${charts.length}`), options));
        } else {
            charts.push(new ApexCharts(document.querySelector(`#chart-${question.id}`), options));
        }
        await charts[charts.length - 1].render();
    };


    // Options generation for graphs

    /**
     *  Generate and return ApexCharts options according to the type of the question to display
     * @param type          Type of the question
     * @param colors        Colors to use for the graph
     * @param labels        Labels to display on the cart
     * @param height        Height of the chart to display (optional)
     * @param width         Width of the chart to display (optional)
     * @param seriesPercent Percentage to use for the graph (optional)
     * @param cursorAverage Average of answers (optional)
     * @param answerChoice      Item to order (optional, only for ranking's question)
     */
    static generateOptions = (type: Types, colors: string[], labels: (string | number)[], height?: any, width?: any,
                              seriesPercent?: number[], cursorAverage?: string, answerChoice?: string[]) : any => {
        let options: any;
        if (type === Types.SINGLEANSWER || type === Types.SINGLEANSWERRADIO) {
            options = {
                chart: {
                    type: 'pie',
                    height: height ? height : 400,
                    width: width ? width : 600,
                    animations: {
                        enabled: false
                    }
                },
                colors: colors,
                labels: labels
            }
        }
        else if (type === Types.MULTIPLEANSWER) {
            options = {
                chart: {
                    type: 'bar',
                    height: height ? height : 400,
                    width: width ? width : 600,
                    animations: {
                        enabled: false
                    }
                },
                plotOptions: {
                    bar: {
                        borderRadius: 4,
                        horizontal: true,
                        distributed: true
                    }
                },
                dataLabels: {
                    enable: true,
                    formatter: function (val: number, opt: any): string {
                        return (val + " (" + seriesPercent[opt.dataPointIndex].toFixed(2)  + "%)")
                    },
                },
                colors: colors,
                xaxis: {
                    categories: labels,
                }
            }
        }
        else if (type === Types.MATRIX) {
            options = {
                chart: {
                    type: 'bar',
                    height: height ? height : 400,
                    width: width ? width : 600,
                    animations: {
                        enabled: false
                    }
                },
                colors: colors,
                dataLabels: {
                    enabled: false
                },
                xaxis: {
                    categories: labels,
                },
                fill: {
                    opacity: 1
                }
            };
        }
        else if (type === Types.CURSOR) {
            options = {
                chart: {
                    type: 'area',
                    height: height ? height : 400,
                    width: width ? width : 600,
                    animations: {
                        enabled: false
                    },
                    toolbar: {
                        show: false
                    },
                    zoom: {
                        enabled: false
                    }
                },
                colors: colors,
                dataLabels: {
                    enabled: false
                },
                xaxis: {
                    categories: labels,
                    title: {
                        text: lang.translate('formulaire.response.average') + ' (' + cursorAverage + ')'
                    }
                },
                yaxis: {
                    opposite: true,
                    labels: {
                        formatter: (value) => {
                            return Math.floor(value)
                        }
                    }
                },
                fill: {
                    type: "gradient",
                    gradient: {
                        shadeIntensity: 1,
                        opacityFrom: 0.7,
                        opacityTo: 0.9,
                        stops: [0, 90, 100]
                    }
                },
            }
        }
        else if (type === Types.RANKING) {
            options = {
                chart: {
                    type: 'bar',
                    height: height ? height : 400,
                    width: width ? width : 600,
                },
                plotOptions: {
                    bar: {
                        horizontal: true,
                        dataLabels: {
                            position: 'top',
                        },
                    }
                },
                colors: colors,
                dataLabels: {
                    enabled: true,
                    offsetX: -6,
                    style: {
                        fontSize: '12px',
                        colors: ['#fff']
                    }
                },
                stroke: {
                    show: true,
                    width: 1,
                    colors: ['#fff']
                },
                xaxis: {
                    categories: labels,
                },
                legend: {
                    show: true,
                    showForSingleSeries: true,
                    customLegendItems: answerChoice,
                    markers: {
                        fillColors: ['#00E396', '#775DD0', '#e3003d']
                    }
                }
            }
        }
        return options;
    }
}