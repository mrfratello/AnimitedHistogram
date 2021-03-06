var max_valueY, // максимальное значение Y
    DURING = 1000, // продолжительность времени, за которое должны выстроиться все колонки (в миллисекундах)
    SMOOTHNESS = 20, // сколько в секунду будет итераций повышения столбика (характеризует сглаженность анимации)
    dataArray = {
        '1998': 12,
        '1999': 22,
        '2000': 22,
        '2001': 23,
        '2002': 135,
        '2003': 20,
        '2004': 151,
        '2005': 52,
        '2006': 162
    };

/**
 * Перезагрузка анимированной гистограммы
 */
function reload_histogram(){
    $('.histogram_box').empty();
    create_histogram();
    run_animation_histogram();
}

/**
 * Создание html-макета для гистограммы
 */
function create_histogram(){
    var valueX;
    max_valueY = 0;
    for ( valueX in dataArray ){
        var html_column = '';
        max_valueY = ( max_valueY < dataArray[valueX] ) ? dataArray[valueX] : max_valueY;
        html_column += '<div class="count_order_item">';
        html_column += '<div class="column"><div class="blind" data-index="' + valueX + '"><div class="count">0</div></div></div>';
        html_column += '<div class="year">' + valueX + '</div>';
        html_column += '</div>';
        $('.histogram_box').append(html_column);
    }
}

/**
 * Запуск анимации в гистограмме
 */
function run_animation_histogram(){
    var valueX,
        iterator,
        interval = Math.floor( 1000 / SMOOTHNESS );
    for ( valueX in dataArray ){
        var valueY = dataArray[valueX];
        iterator = Math.ceil( valueY / ( SMOOTHNESS * DURING  / 1000 ) );
        animate_column( valueX, 0, iterator, interval);
    }
}

/**
 * Анимирование отдельной колонки в гистограмме
 * @param  {string} valueX значение X
 * @param  {int} current  текущая "высота" на которую поднялась колонка
 * @param  {int} iterator шаг, с которым должна подниматься колонка
 * @param  {int} interval интервал времени, через который надо поднять колонку
 */
function animate_column( valueX, current, iterator, interval){
    var blind_padding_top;
    if ( current < dataArray[valueX] ){
        current += iterator;
        current = ( current > dataArray[valueX] ) ? dataArray[valueX] : current;
        blind_padding_top = Math.ceil( 100 * ( 1 - current / max_valueY ) );

        $('.count','.blind[data-index=' + valueX + ']').html(current);
        $('.blind[data-index='+valueX+']').css('paddingTop', blind_padding_top);
        setTimeout(
            function(){
                animate_column(valueX, current, iterator, interval);
            },
            interval
        );
    }
}

$(document).ready(function(){
    reload_histogram();
    setInterval(
        function(){
            reload_histogram();
        },
        DURING + 1000
    );
});
