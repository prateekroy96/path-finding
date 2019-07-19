//import { maze } from "./input";

/*
0 is unblocked
1 is blocked
2 is start
3 is goal
4 is path
5 is explored
*/

//no heuristic
h0 = function (currentposn, endposn) {
    return 0;
}

//manhattan distance
h1 = function (currentposn, endposn) {
    return (Math.abs(currentposn[0] - endposn[0]) + Math.abs(currentposn[1] - endposn[1]));
}

//euclidean distance
h2 = function (currentposn, endposn) {
    return (Math.sqrt(Math.pow(currentposn[0] - endposn[0], 2) + Math.pow(currentposn[1] - endposn[1], 2)));
}

//horizontal distance
h3 = function (currentposn, endposn) {
    return Math.abs(currentposn[1] - endposn[1]);
}

//vertical distance
h4 = function (currentposn, endposn) {
    return Math.abs(currentposn[0] - endposn[0]);
}

let loop = 0;
let path_found = false;


path = function (maze, startposn, endposn, w1, w2, w3, w4) {
    //const heuristics = require('./heuristics');
    //const input = require("./input");
    //node class


    class node {

        constructor(parent = null, posn = null, f, g, h) {
            this.parent = parent;
            this.posn = posn;
            this.f = 0;
            this.g = 0;
            this.h = 0;
        }

    }

    //maze details
    //maze = [[0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0]];
    //startposn = [0, 0];
    //endposn = [3, 4];
    //console.log("maze in path");
    //console.log(maze);

    //essential functions
    let is_inrange = function (pos) {
        if (pos[0] < maze[0].length && pos[0] >= 0 && pos[1] < maze.length && pos[1] >= 0)
            return true;
        else
            return false;
    }

    let is_unblocked = function (pos) {
        if (maze[pos[1]][pos[0]] === 0)
            return true;
        else
            return false;
    }

    let is_not_inclosed = function (pos, c_list) {
        for (let item of c_list) {
            //console.log(item.posn,pos,item.posn==pos);
            if (item.posn[0] === pos[0] && item.posn[1] === pos[1]) {
                //console.log("trig");
                return false;
            }

        }
        return true;
    }


    //start and end node
    let start = new node(null, startposn);
    let end = new node(null, endposn);
    let path = [];

    //open and closed list
    open_list = [];
    closed_list = [];

    //adding start node
    open_list.push(start);

    //loop until end
    loop = 0;
    while (open_list.length > 0 /*&& i<5*/) {

        //current open list index
        current_node = open_list[0];
        current_ind = 0;
        for (let index in open_list) {
            if (open_list[index].f < current_node.f) {
                current_node = open_list[index];
                current_ind = index;
            }
        }
        //console.log('updated current ' + current_node.posn.toString());

        //removing current item from open list and adding to close list
        closed_list.push(open_list.splice(current_ind, 1)[0]);
        //console.log(' length of open:' + open_list.length.toString());
        //console.log(open_list);
        //console.log('length of close:' + closed_list.length.toString());
        //console.log(closed_list);

        //if destination is reached
        if (current_node.posn[0] === end.posn[0] && current_node.posn[1] === end.posn[1]) {
            //console.log("reached goal");
            path_found=true;
            current = current_node;
            while (current !== null) {
                path.unshift(current.posn);
                current = current.parent;
            }
            break;
          
        }

        //generating children
        //let delta = [[1, 0], [-1, 0], [0, 1], [0, -1]];

        let delta = [[1, 0], [-1, 0], [0, 1], [0, -1]/*, [1, 1], [1, -1], [-1, 1], [-1, -1]*/];

        let children = [];
        for (let del of delta) {
            let position = [0, 0];
            position[0] = current_node.posn[0] + del[0];
            position[1] = current_node.posn[1] + del[1];

            //console.log('child ' + position);
            //console.log(is_inrange(position));
            //console.log(is_unblocked(position));
            //console.log(position + is_not_inclosed(position, closed_list));

            //check for position validity
            if (is_inrange(position) && is_unblocked(position) && is_not_inclosed(position, closed_list)) {
                //console.log('trigger');

                //creating child
                let child = new node(current_node, position)

                //evaluating cost
                child.g = current_node.g + 1;

                //weighted average of heuristic functions
                if (w1 + w2 + w3 + w4 === 0)
                    child.h = h0(position, endposn);
                else
                    child.h = (w1 * h1(position, endposn) + (w2 * h2(position, endposn)) + w3 * h3(position, endposn) + w4 * h4(position, endposn)) / (w1 + w2 + w3 + w4);
                child.f = child.g + child.h;

                children.push(child);
            }
        }

        //console.log(children);

        for (child of children) {
            sub_child = open_list.filter(function (item) {
                if (item.posn[0] === child.posn[0] && item.posn[1] === child.posn[1] && child.g >= item.g)
                    return true;
                else
                    return false;
            })
            if (sub_child.length > 0)
                continue;
            else
                open_list.push(child);
        }
        /*
        console.log("----------------");
        for(let item of closed_list){
            console.log(item.posn,item.f,item.g,item.h);
        }
        console.log("---");
        for(let item of open_list){
            console.log(item.posn,item.f,item.g,item.h);
        }*/

        loop++;
    }

    //console.log(maze);
    //console.log(path);
    //console.log('no of steps:' + (path.length - 1));

    let mazesol = maze;
    for (let item of closed_list) {
        mazesol[item.posn[1]][item.posn[0]] = 5;
    }
    for (let item of path) {
        mazesol[item[1]][item[0]] = 4;
    }
    mazesol[startposn[1]][startposn[0]] = 2;
    mazesol[endposn[1]][endposn[0]] = 3;

    //console.log(mazesol);
    return mazesol;
}



$(function () {
    var rangeSlider = function () {
        var slider = $('.range-slider'),
            range = $('.range-slider__range'),
            value = $('.range-slider__value');

        slider.each(function () {

            value.each(function () {
                var value = $(this).prev().attr('value');
                $(this).html(value);
            });

            range.on('input', function () {
                $(this).next(value).html(this.value);
            });
        });
    };

    rangeSlider();

    //const pathfind = require('./pathfind.js');
    let x = [];
    let n = 225; //grid size
    let l = 15;
    for (let i = 0; i < n; i++) {
        x[i] = $('#x' + i);
        x[i].state = 0;
        x[i].css('background-color', '#FCFFF5');
    }

    let startpos = 0;
    x[startpos].state = 2;
    x[startpos].css('background-color', '#3E606F');

    let endpos = n - 1;
    x[endpos].state = 3;
    x[endpos].css('background-color', '#3E606F');

    /*console.log('initial maze');
    for (let i = 0; i < n; ++i)
    console.log(x[i].state);*/

    for (let i = 0; i < n; ++i) {

        //x[i].css('background-color', '#C8C8C8');
        x[i].click(function () {
            if (x[i].state === 1) {
                x[i].state = 0;
                x[i].css('background-color', '#FCFFF5');
            }
            else if (x[i].state === 0) {
                x[i].state = 1;
                x[i].css('background-color', '#193441');
            }
            else
                alert('Can\'t block this position');
        })
    }

    $('#startbut').click(function () {
        if ($('#startinp').val() < n) {
            startpos = $('#startinp').val();
            for (let i = 0; i < n; ++i)
                if (x[i].state === 2) {
                    x[i].state = 0;
                    x[i].css('background-color', '#FCFFF5');
                }
            x[startpos].state = 2;
            x[startpos].css('background-color', '#3E606F');
        }
        else
            alert('value not in range');

    })

    $('#endbut').click(function () {
        if ($('#endinp').val() < n) {
            endpos = $('#endinp').val();
            for (let i = 0; i < n; ++i)
                if (x[i].state === 3) {
                    x[i].state = 0;
                    x[i].css('background-color', '#FCFFF5');
                }
            x[endpos].state = 3;
            x[endpos].css('background-color', '#3E606F');
        }
        else
            alert('value not in range');

    })

    $('#reset').click(function () {
        for (let i = 0; i < n; i++) {
            //x[i] = $('#x' + i);
            x[i].state = 0;
            x[i].css('background-color', '#FCFFF5');
        }

        let startpos = 0;
        x[startpos].state = 2;
        x[startpos].css('background-color', '#3E606F');

        let endpos = n - 1;
        x[endpos].state = 3;
        x[endpos].css('background-color', '#3E606F');
        
    })

    $('#find').click(function () {

        //taking heuristic functions
        //console.log($("#h0").val());

        let w1 = $("#h1").val();
        w1 = parseInt(w1, 10);
        let w2 = $("#h2").val();
        w2 = parseInt(w2, 10);
        let w3 = $("#h3").val();
        w3 = parseInt(w3, 10);
        let w4 = $("#h4").val();
        w4 = parseInt(w4, 10);



        let row = [];
        let mazee = [];
        let startposn = [0, 0];
        let endposn = [n / l - 1, n / l - 1];

        for (let j = 0; j < l; j++)
            row[j] = 0;

        for (let j = 0; j < n / l; j++)
            mazee[j] = row;

        //console.log('maze');
        //console.log(mazee);
        let maz = mazee;
        mazee = [[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,]];


        for (let i = 0; i < n; i++) {
            c = i % l;
            b = (i - i % l) / l;
            mazee[b][c] = x[i].state;
            if (x[i].state === 2) {
                startposn = [c, b];
                mazee[b][c] = 0;
            }
            if (x[i].state === 3) {
                endposn = [c, b];
                mazee[b][c] = 0;
            }
            //console.log(mazee[b][c]);
        }

        //console.log('maze updated');
        //console.log(mazee);
        //console.log(startposn);
        //console.log(endposn);

        //mazee = [[0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0]];


        let mazesol = path(mazee, startposn, endposn, w1, w2, w3, w4);
        let mazelin = [];

        console.log(loop);

        for (let i = 0; i < l; i++)
            for (let j = 0; j < n / l; j++)
                mazelin[j * l + i] = mazesol[j][i];

        //console.log('mazelin');
        //console.log(mazelin);

        for (let i = 0; i < n; i++) {
            switch (mazelin[i]) {
                case 0:
                    x[i].state = 0;
                    x[i].css('background-color', '#FCFFF5');
                    break;
                case 1:
                    x[i].state = 1;
                    x[i].css('background-color', '#193441');
                    break;
                case 2:
                    x[i].state = 2;
                    x[i].css('background-color', '#3E606F');
                    break;
                case 3:
                    x[i].state = 3;
                    x[i].css('background-color', '#3E606F');
                    break;
                case 4:
                    x[i].state = 4;
                    x[i].css('background-color', '#91AA9D');
                    break;
                case 5:
                    x[i].state = 5;
                    x[i].css('background-color', '#D1DBBD');

            }
        }
        

        let res = $("#result")
        res.empty();
        res.append('Result:');
        if(!path_found)
        res.append('<br>Path not found!');
        else
        res.append('<br>Path found!');
        res.append('<br>Number of explored nodes: ' + loop);
        
    })
});

