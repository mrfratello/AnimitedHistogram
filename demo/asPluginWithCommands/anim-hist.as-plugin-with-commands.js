(function($){
    var methods = {
            /**
             * Инициализация плагина на выбранном элементе
             * @param options
             * @returns {*}
             */
            init: function(options){
                options = $.extend({}, defaults, options || {});

                return this.each(function(){
                    var element_box = $(this);
                    element_box.addClass('histogram_box');
                    element_box.data('animated_histogram', options);
                    methods._render_histogram.apply(element_box, []);
                });
            },

            /**
             * Отрисовка элементов гистограммы
             * @private
             */
            _render_histogram: function(){
                var element_box = $(this),
                    options = element_box.data('animated_histogram'),
                    valueX,
                    data = options.data,
                    max_valueY = 0;

                for ( valueX in data ){
                    max_valueY = ( max_valueY < data[valueX] ) ? data[valueX] : max_valueY;

                    var html_column = '';
                    html_column += '<div class="count_order_item" data-index="' + valueX + '">';
                    html_column += '<div class="column"><div class="blind" data-index="' + valueX + '"><div class="count">0</div></div></div>';
                    html_column += '<div class="year">' + valueX + '</div>';
                    html_column += '</div>';
                    element_box.append(html_column);
                }
                options.maxValueY = max_valueY;
                element_box.data('animated_histogram', options);
                if ( options.autorun ) {
                    methods.run_animation.apply(element_box);
                }
            },

            /**
             * Запуск анимации
             * @returns {*|HTMLElement}
             */
            run_animation: function(){
                var element_box = $(this),
                    options = element_box.data('animated_histogram'),
                    data = options.data;
                for (var valueX in data ){
                    var valueY = data[valueX],
                        interval_data = methods._get_iteration_value(valueY, options.during, options.speed_animation),
                        column = element_box.find('[data-index=' + valueX + ']'),
                        dict = {
                            maxValueY: options.maxValueY,
                            count_element: column.find('.count'),
                            blind_element: column.find('.blind'),
                            iterator: interval_data.iteration,
                            interval: interval_data.interval
                        };

                    methods._animate_column.apply(dict, [valueY, 0]);
                }
                return element_box;
            },

            /**
             * Анимация колонки
             * @param valueY
             * @param current
             * @private
             */
            _animate_column: function( valueY, current){
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
                            methods._animate_column.apply(dict, [valueY, current]);
                        },
                        dict.interval
                    );
                }
            },

            /**
             * Получение информации об интервале и добавочной информации
             * @param absolute_value
             * @param during
             * @param speed
             * @returns {{iteration: number, interval: number}}
             * @private
             */
            _get_iteration_value: function(absolute_value, during, speed){
                var interval = Math.floor(1000 / speed);
                return {
                    iteration: Math.ceil( (absolute_value * interval) / during ),
                    interval: interval
                };
            }
        },
        defaults =  {
            during: 500,
            data: {
                '100': 120,
                '101': 120,
            },
            speed_animation: 100,
            autorun: true
        };

    $.fn.animHist = function(parametr){
        if ( typeof parametr == 'string' || methods[parametr] ){
            return this.each(function(){
                var element_box = $(this);
                methods[parametr].apply( element_box );
            });
        } else if (parametr === null || typeof parametr == 'object'){
            return methods.init.apply(this, [parametr]);
        } else {
            $.error('Animated Histogram. Error in call methods');
        }
    };

}(jQuery));
