(function($){

    $.fn.animHist = function(options) {
        var defaults = {
                during: 500,
                data: {
                    '100': 30,
                    '101': 120,
                    '102': 80
                },
                smoothness: 25
            },
            settings = $.extend({}, defaults, options || {});
        settings.interval = Math.floor( 1000 / settings.smoothness );

        return this.each(function() {
            var elementBox = $(this);
            elementBox.addClass('histogram_box');
            elementBox.data('animated_histogram', settings);
            render_histogram.apply( elementBox );
            run_animation.apply( elementBox );
        });
    };

    /**
     * Отрисовка элементов гистограммы
     */
    function render_histogram() {
        var element_box = $(this),
            options = element_box.data('animated_histogram'),
            data = options.data,
            max_valueY = 0;
        for (var valueX in data ){
            var valueY = data[valueX],
                htmlColumn = '';
            htmlColumn += '<div class="count_order_item" data-index="' + valueX + '">';
            htmlColumn += '<div class="column"><div class="blind" data-index="' + valueX + '"><div class="count">0</div></div></div>';
            htmlColumn += '<div class="year">' + valueX + '</div>';
            htmlColumn += '</div>';
            element_box.append(htmlColumn);

            if ( max_valueY < valueY ) {
                max_valueY = valueY;
            }
        }
        options.maxValueY = max_valueY;
        element_box.data('animated_histogram', options);
    }

    /**
     * Запуск анимации в гистограмме
     */
    function run_animation() {
        var element_box = $(this),
            options = element_box.data('animated_histogram'),
            data = options.data;
        for (var valueX in data ){
            var valueY = data[valueX],
                iterator = Math.ceil( valueY / ( options.smoothness * options.during / 1000 ) ),
                column = element_box.find('[data-index=' + valueX + ']'),
                dict = {
                    maxValueY: options.maxValueY,
                    count_element: column.find('.count'),
                    blind_element: column.find('.blind'),
                    iterator: iterator,
                    interval: options.interval
                };
            animate_column.apply(dict, [valueY, 0]);
        }
        return element_box;
    }

    /**
     * Анимация колонки
     * @param  {int} valueY  до какого значения Y должна подняться колонка
     * @param  {int} current текущее значение Y у колонки
     */
    function animate_column(valueY, current) {
        var dict = this,
            blind_padding_top;
        if ( current < valueY ){
            current += dict.iterator;
            current = ( current > valueY ) ? valueY : current;
            blind_padding_top = Math.ceil( 100 * ( 1 - current / dict.maxValueY ) );

            dict.count_element.html(current);
            dict.blind_element.css('paddingTop', blind_padding_top);
            setTimeout(
                function(){
                    animate_column.apply(dict, [valueY, current]);
                },
                dict.interval
            );
        }
    }

}(jQuery));
