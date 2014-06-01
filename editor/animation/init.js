//Dont change it
requirejs(['ext_editor_1', 'jquery_190', 'raphael_210'],
    function (ext, $, TableComponent) {

        var cur_slide = {};

        ext.set_start_game(function (this_e) {
        });

        ext.set_process_in(function (this_e, data) {
            cur_slide["in"] = data[0];
        });

        ext.set_process_out(function (this_e, data) {
            cur_slide["out"] = data[0];
        });

        ext.set_process_ext(function (this_e, data) {
            cur_slide.ext = data;
            this_e.addAnimationSlide(cur_slide);
            cur_slide = {};
        });

        ext.set_process_err(function (this_e, data) {
            cur_slide['error'] = data[0];
            this_e.addAnimationSlide(cur_slide);
            cur_slide = {};
        });

        ext.set_animate_success_slide(function (this_e, options) {
            var $h = $(this_e.setHtmlSlide('<div class="animation-success"><div></div></div>'));
            this_e.setAnimationHeight(115);
        });

        ext.set_animate_slide(function (this_e, data, options) {
            var $content = $(this_e.setHtmlSlide(ext.get_template('animation'))).find('.animation-content');
            if (!data) {
                console.log("data is undefined");
                return false;
            }

            var checkioInput = data.in || [[4, 3], [6, 3]];

            if (data.error) {
                $content.find('.call').html('Fail: checkio(' + JSON.stringify(checkioInput) + ')');
                $content.find('.output').html(data.error.replace(/\n/g, ","));

                $content.find('.output').addClass('error');
                $content.find('.call').addClass('error');
                $content.find('.answer').remove();
                $content.find('.explanation').remove();
                this_e.setAnimationHeight($content.height() + 60);
                return false;
            }

            var rightResult = data.ext["answer"];
            var userResult = data.out;
            var result = data.ext["result"];
            var result_addon = data.ext["result_addon"];


            //if you need additional info from tests (if exists)
            var explanation = data.ext["explanation"];

            $content.find('.output').html('&nbsp;Your result:&nbsp;' + JSON.stringify(userResult));

            if (!result) {
                $content.find('.call').html('Fail: checkio(' + JSON.stringify(checkioInput) + ')');
                $content.find('.answer').html('Right result:&nbsp;' + JSON.stringify(rightResult));
                $content.find('.answer').addClass('error');
                $content.find('.output').addClass('error');
                $content.find('.call').addClass('error');
            }
            else {
                $content.find('.call').html('Pass: checkio(' + JSON.stringify(checkioInput) + ')');
                $content.find('.answer').remove();
            }
            //Dont change the code before it

            var eCanvas = new DeterminantCanvas();
            eCanvas.createCanvas($content.find(".explanation")[0], checkioInput);



            this_e.setAnimationHeight($content.height() + 60);

        });

        var $tryit;
        var tCanvas;
//
        ext.set_console_process_ret(function (this_e, ret) {

            $tryit.find(".checkio-result-in").html(ret);
        });

        ext.set_generate_animation_panel(function (this_e) {

            $tryit = $(this_e.setHtmlTryIt(ext.get_template('tryit')));
            tCanvas = new DeterminantCanvas();


            $tryit.find('form').submit(function (e) {
                e.preventDefault();
                var row = parseInt($tryit.find(".input-row").val());
                if (!row || isNaN(row) || row < 1 || row > 6) {
                    row = 5;
                }
                $tryit.find(".input-row").val(row);
                var data = [];
                for (var i = 0; i < row; i++) {
                    var temp = [];
                    for (var j = 0; j < row; j++) {
                        temp.push(Math.floor(Math.random() * 10));
                    }
                    data.push(temp);
                }
                tCanvas.removeCanvas();
                $tryit.find("table tr:first").show();
                tCanvas.createCanvas($tryit.find(".input-canvas")[0], data);
                this_e.sendToConsoleCheckiO(data);
                e.stopPropagation();
                return false;
            });

        });

        var colorOrange4 = "#F0801A";
        var colorOrange3 = "#FA8F00";
        var colorOrange2 = "#FAA600";
        var colorOrange1 = "#FABA00";

        var colorBlue4 = "#294270";
        var colorBlue3 = "#006CA9";
        var colorBlue2 = "#65A1CF";
        var colorBlue1 = "#8FC7ED";

        var colorGrey4 = "#737370";
        var colorGrey3 = "#9D9E9E";
        var colorGrey2 = "#C5C6C6";
        var colorGrey1 = "#EBEDED";

        var colorWhite = "#FFFFFF";


        function DeterminantCanvas() {
            var zx = 10;
            var zy = 10;
            var cellSize = 30;
            var cellN = [];
            var fullSize = [];

            var colorDark = "#294270";
            var attrBracket = {"stroke": colorDark, "stroke-width": 3};
            var attrNumber = {"stroke": colorDark, "font-family": "Verdana", "font-size": cellSize * 0.6};
            var attrSup = {"stroke": colorDark, "font-family": "Verdana", "font-size": cellSize * 0.35, "opacity": 0};

            var paper;
            var numberSet;
            var letterA;
            var leftBracket;
            var rightBracket;

            this.removeCanvas = function () {
                if (paper) {
                    paper.remove();
                }
            };

            this.createCanvas = function (dom, matrix) {
                cellN = matrix.length;

                fullSize = [zx * 2 + cellN * cellSize, zy * 2 + cellN * cellSize];
                paper = Raphael(dom, fullSize[0], fullSize[1], 0, 0);
                numberSet = paper.set();

//                if (!shortCanvas) {
//                    letterA = paper.text(zx / 2, zy + cellSize * cellN[1] / 2, "A").attr(attrNumber);
//                }
                leftBracket = paper.path(
                    "M" + zx + "," + zy + "V" + (zy + cellSize * cellN)).attr(attrBracket);
                rightBracket = paper.path(
                    "M" + (zx + cellN * cellSize) + "," + zy + "V" + (zy + cellSize * cellN)).attr(attrBracket);
                for (var row = 0; row < matrix.length; row++) {
                    for (var col = 0; col < matrix[0].length; col++) {
                        numberSet.push(paper.text(
                            zx + cellSize * col + cellSize / 2,
                            zy + cellSize * row + cellSize / 2,
                            matrix[row][col]
                        ).attr(attrNumber));
                    }
                }
            };

        }


    }
);
