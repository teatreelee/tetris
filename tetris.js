//declare global object tetris
var tetris = {};

//draw grid
tetris.drawPlayField = function() {
	for (var row = 0; row < 22; row++) {
		$('#playfield').append('<tr class ="'+ row + '"></tr>');
		for (var col = 0; col < 10; col++) {
			$('.' + row).append('<td id="' + col + '"></td>')
		}
	}
}

//variable to store current coordinates

tetris.origin = {row: 5, col: 5};
tetris.currentShape = 'L';

tetris.currentCoor;

tetris.shapeToCoor =  function(shape,origin) {
	if (shape === 'L') {
		return [{row:origin.row, col: origin.col},
				{row: origin.row -1, col: origin.col},
				{row:origin.row + 1, col: origin.col},
				{row: origin.row + 1, col: origin.col + 1}]
	} else if (shape === 'L90'){
 		return [{row:origin.row,col:origin.col},
          {row:origin.row,col:origin.col+1},
          {row:origin.row,col:origin.col-1},
          {row:origin.row+1,col:origin.col-1}]
      } else if (shape === 'J') {
		return [{row:origin.row, col: origin.col},
				{row:origin.row, col: origin.col + 1},
				{row:origin.row, col: origin.col -1},
				{row:origin.row-1, col: origin.col -1}]
	} else if (shape === 'I') {
		return [{row:origin.row, col: origin.col},
				{row:origin.row, col: origin.col+1},
				{row:origin.row, col: origin.col - 2},
				{row:origin.row, col: origin.col - 1},]
	} else if (shape === 'O') {
		return [{row:origin.row, col: origin.col},
				{row:origin.row, col: origin.col + 1},
				{row:origin.row-1, col: origin.col+1},
				{row:origin.row-1, col: origin.col},]
	} else if (shape === 'S'){
		return [{row:origin.row, col: origin.col},
				{row:origin.row, col: origin.col + 1},
				{row:origin.row +1, col: origin.col},
				{row:origin.row+1, col: origin.col -1},]
	} else if (shape === 'T') {
		return [{row:origin.row, col: origin.col},
				{row:origin.row, col: origin.col +1},
				{row:origin.row, col: origin.col -1},
				{row:origin.row-1, col: origin.col}]
	} else if (shape === 'Z') {
		return [{row:origin.row, col: origin.col},
				{row:origin.row, col: origin.col -1},
				{row:origin.row +1, col: origin.col},
				{row:origin.row + 1, col: origin.col +1}]
	}

}

//Fill the cells
tetris.fillCells = function(coordinates, fillColor){
	for (var i = 0; i < coordinates.length; i++) {
		var row = coordinates[i].row;
		var col = coordinates[i].col;
		var $coor = $('.'+row).find('#'+col);
		$coor.attr('bgcolor', fillColor);
	}
}


tetris.ifReverse = function(){
  for(var i=0;i<this.currentCoor.length;i++){
    var row = this.currentCoor[i].row;
    var col = this.currentCoor[i].col;
    var $coor = $('.'+row).find('#'+col);
    if($coor.length === 0 || $coor.attr('bgcolor')== "black"){
      return true;
    }
  }
  return false;
}

tetris.move = function(direction) {
	this.fillCells(this.currentCoor, '');
	if(direction === 'right'){
		this.origin.col++;
	} else if (direction === 'left'){
		this.origin.col--;
	}
	this.currentCoor = this.shapeToCoor(this.currentShape, this.origin);

	if (this.ifReverse()) {
		if (direction === 'left') {
			this.origin.col++;
		} else if (direction === 'right') {
			this.origin.col--;
	}

	}
	this.currentCoor = this.shapeToCoor(this.currentShape, this.origin);
	this.fillCells(this.currentCoor, 'black');
}

// call rotate when up arrow is pressed

tetris.rotate = function() {
	var lastShape = this.currentShape;
	this.fillCells(this.currentCoor, '');
	if (this.currentShape === 'L') {
		this.currentShape = 'L90';
	} else if (this.currentShape === 'L90') {
		this.currentShape = 'L';
	}
	this.currentCoor = this.shapeToCoor(this.currentShape, this.origin);
	for (var i = 0; i < this.currentCoor.length; i++) {
		if (this.ifReverse()) {
			this.currentShape = lastShape;
		}
	}
	this.currentCoor = this.shapeToCoor(this.currentShape, this.origin);
	this.fillCells(this.currentCoor, 'black');
}


tetris.drop = function(){
	var reverse = false;

	this.fillCells(this.currentCoor,'');
	this.origin.row++;
	for(var i=0;i<this.currentCoor.length;i++){
		this.currentCoor[i].row++;
		if(this.ifReverse()){
			reverse = true;
		}
	}

	if(reverse){
		for(var i=0;i<this.currentCoor.length;i++){
			this.currentCoor[i].row--;
		}
		this.origin.row--;
	}

	this.fillCells(this.currentCoor,'black');

	if(reverse){
		//this.fillCells(this.currentCoor,'BLACK');
		this.spawn();
	}
}

tetris.spawn = function() {
	this.currentShape = 'L';
	this.origin = {row:2,col:5};
	this.currentCoor = this.shapeToCoor(this.currentShape, this.origin);
}

// call drawPlayField
$(document).ready(function(){
	tetris.drawPlayField();
	tetris.currentCoor = tetris.shapeToCoor(tetris.currentShape, tetris.origin);
	tetris.fillCells(tetris.currentCoor, 'black');
	$(document).keydown(function(e) {
		console.log(e.keyCode);
		if (e.keyCode === 39) {
			tetris.move('right');
		} else if (e.keyCode === 37) {
			tetris.move('left');
		} else if (e.keyCode === 38) {
			tetris.rotate();
		} else if (e.keyCode === 40) {
			tetris.drop();
		}
	})
	var gravity = setInterval(function(){
		tetris.drop();
		}, 500);	
})