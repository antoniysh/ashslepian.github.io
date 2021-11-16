let calculateBtn = document.getElementById("calculate")
let matrixG = 0
calculateBtn.addEventListener("click",()=>{
	try{
		tbl = document.getElementById("tbl")
		tbl.remove()
	}catch(qq){
		console.log("asd")

	}
	document.getElementById("cwev").innerHTML = ""
	matrixG = document.getElementById("g").value
	matrixU = document.getElementById("u").value
	let g = inputToMatrix(matrixG)
	let u = inputToMatrix(matrixU)
	validate(g,u)
	u.forEach((el, i, self)=>{
		self[i] = self[i].join('')
	})
	console.log(u)
	let words = getCodeWords(g)
	let table = findError(words)
	tableToString(table)
	createTable(table)
	document.getElementById("cwev").innerHTML += "Кодови думи: ["
	table[0].forEach(word =>{
		document.getElementById("cwev").innerHTML += word
		document.getElementById("cwev").innerHTML += ", "
	})
	document.getElementById("cwev").innerHTML += "] <br><br>"
	document.getElementById("cwev").innerHTML += "Вектори на грешката: ["
	table.forEach((el,i,self)=> {
		if(i != 0){
		document.getElementById("cwev").innerHTML += self[i][0]
		document.getElementById("cwev").innerHTML += ", "}
	})
	document.getElementById("cwev").innerHTML += "]<br><br>"

	u.forEach((el,i,self)=>{
		let check = 0
		for(let j = 0; j < table.length; j++){
			for(let k = 1; k < table[j].length; k++){
				if(self[i].localeCompare(table[j][k])==0){
					check = 1
					document.getElementById("cwev").innerHTML += self[i]
					document.getElementById("cwev").innerHTML += " открита с грешка: "
					document.getElementById("cwev").innerHTML += table[j][0]
					document.getElementById("cwev").innerHTML += "<br>"
				}

			}
		}
		if(check == 0){
			document.getElementById("cwev").innerHTML += self[i]
			document.getElementById("cwev").innerHTML += " думата не е открита <br>"

		}
	})


	
})


function getK(arr){
	return arr.length
}
function getN(arr){
	return arr[1].length
}

function inputToMatrix(matrix){
	let arr = matrix.split("\n")
	let arr1 = []
	let arr2 = []
	let i = 0;
	arr.forEach(item =>{
			arr1[i] = item.split(/\s*[\s,]\s*/)
		i++
	})
	arr1.forEach(item =>{
		item.forEach( (item, i, self) => self[i] = Number(item ))
	})

	return arr1
}

function getCodeWords(arr){
	let words = []
	let zeroWord = []
	let temp = []
	let combinations = []
	let count = Math.pow(2,getK(arr))
	arr[1].forEach(item =>{
		zeroWord.push(0)
	})
	words.push(zeroWord)
	arr.forEach(item =>{
		words.push(item)
	})
	/////////////////////////////////////////
	combinations = getCombinations(arr)
	combinations = combine(combinations,2)
	combinations.forEach(combination=>{
		combination.forEach(q =>{
			temp.push(arr[q])
		})
		let word = BinaryAdditionComplex(temp)
		words.push(word)
		temp = []
	})
	return words
}

function BinaryAdditionSimple(arr1,arr2){
	let answer = []
	let length = arr1.length - 1
	//console.log(length)
	for(let i = 0; i <= length; i++ ){
		if(arr1[i] == 0 && arr2[i] == 0) answer[i] = 0;
		if(arr1[i] == 1 && arr2[i] == 0) answer[i] = 1;
		if(arr1[i] == 0 && arr2[i] == 1) answer[i] = 1;
		if(arr1[i] == 1 && arr2[i] == 1) answer[i] = 0;
	}
	return answer
}
function BinaryAdditionComplex(arr){
	let answer = []
	let temp = zeroWord(arr[0].length)
	arr.forEach(item =>{
		 temp = BinaryAdditionSimple(item,temp)
	})
	return temp
}

function stringToInt(num){
	num = Number(num)
}

function getCombinations(arr){
	let combinations = []
	for(let i = 0; i < getK(arr);i++){
		combinations.push(i);
	}
	return combinations
}

var combine = function(a, min) {
    var fn = function(n, src, got, all) {
        if (n == 0) {
            if (got.length > 0) {
                all[all.length] = got;
            }
            return;
        }
        for (var j = 0; j < src.length; j++) {
            fn(n - 1, src.slice(j + 1), got.concat([src[j]]), all);
        }
        return;
    }
    var all = [];
    for (var i = min; i < a.length; i++) {
        fn(i, a, [], all);
    }
    all.push(a);
    return all;
}

var zeroWord = function(x){
	let z = [];
	for(let i = 0; i <= x; i++){z.push(0)}
	return z;
}

var findError = function(words){
	let w  = 0
	let d = 99999
	let errorVectors = []
	//let table = [words]
	let errorCombinations = []
	words.forEach(word => {
		word.forEach(symbol =>{
			if(symbol == 1) w++;
		})
		if(w < d && w != 0) d = w;
		w = 0
	})
	let t = (d+1)/2
	if(t % 1 == 0) {
		t = t-1}
	if(t % 1 != 0) {
		t = Math.floor(t)
	}
	let errorVectorLength = words[0].length - 1
	for(let i = 0; i <= errorVectorLength; i++){
		errorCombinations.push(i)
	}
	err = combine(errorCombinations,1);
	//console.log(err)
	for(let i = err.length - 1; i >= 0; i--){
		if (err[i].length > t){
			err.pop()
		}
	}

	for(let i = 0; i < err.length; i++){
		errorVectors.push(zeroWord(errorVectorLength))
	}
	//console.log(errorVectors.length," ", err[0].length)

	errorVectors.forEach((item,i,self) => {
		err[i].forEach(el =>{
			self[i][el] = 1;
		})
	})


	
	let table = []
	table.push(words)
	for(let i = 1; i <= errorVectors.length; i++){
		table[i] = new Array()
		table[i].push(errorVectors[i-1])
	}
	
	/*for(let i = 1; i < table.length; i++){
		for(j = 1; j < table[0].length; j++){
			temp = BinaryAdditionSimple(table[i][0],table[0][j])
			table.push(temp)
			console.log(table[i][0].length,"|",table[0][j].length)
		}
	}

	table[1].forEach((item,i,self)=>{
		table[1][i] = BinaryAdditionSimple[table[1][0],table[0][i]]
	})*/
	//console.log(errorVectors[1],"|",words[1])
	//console.log(BinaryAdditionSimple(words[1],errorVectors[1]))
	for(let i = 1; i < table.length; i++){
		for(let j = 1; j < words.length; j++){
			table[i][j] = BinaryAdditionSimple(errorVectors[i-1],words[j])
		}
	}
	//table.forEach(item=>{console.log(item)})
	//console.log(table)
	return table


	//console.log(table)
	//console.log(words)


}
function tableToString(table){
	for(i = 0; i < table.length; i++){
		for(j = 0; j < table[i].length; j++){
			table[i][j] = table[i][j].join('')
			console.log(table[i][j])
		}
	}
	console.log(table)
}

function createTable(tableData) {
  var table = document.createElement('table');
  table.setAttribute("id","tbl")
  var tableBody = document.createElement('tbody');

  tableData.forEach(function(rowData) {
    var row = document.createElement('tr');

    rowData.forEach(function(cellData) {
      var cell = document.createElement('td');
      cell.appendChild(document.createTextNode(cellData));
      row.appendChild(cell);
    });

    tableBody.appendChild(row);
  });

  table.appendChild(tableBody);
  document.body.appendChild(table);
}

let validate = function(arr1,arr2){
	arr1.forEach(el=>{
		if(el.length != arr1[0].length){
			alert("Невалидни данни")
		}
	})
	arr2.forEach(el=>{
		if(el.length != arr2[0].length){
			alert("Невалидни дани")
		}
	})
}