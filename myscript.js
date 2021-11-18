let calculateBtn = document.getElementById("calculate")
let returnDiv = document.getElementById("cwev")
let matrixG = 0
calculateBtn.addEventListener("click",()=>{
	try{
		tbl = document.getElementById("tbl")
		tbl.remove()
	}catch(qq){}
	returnDiv.innerHTML = ""
	let matrixG = document.getElementById("g").value
	let matrixU = document.getElementById("u").value
	let g = inputToMatrix(matrixG)
	let u = inputToMatrix(matrixU)
	validate(g,u)
	u.forEach((el, i, self)=>{
		self[i] = self[i].join('')
	})
	let words = getCodeWords(g)
	let table = findError(words)
	tableToString(table)
	createTable(table)
	returnDiv.innerHTML += "Кодови думи: ["
	table[0].forEach(word =>{
		returnDiv.innerHTML += word
		returnDiv.innerHTML += ", "
	})
	returnDiv.innerHTML += "] <br><br>"
	returnDiv.innerHTML += "Вектори на грешката: ["
	table.forEach((el,i,self)=> {
		if(i != 0){
		returnDiv.innerHTML += self[i][0]
		returnDiv.innerHTML += ", "}
	})
	returnDiv.innerHTML += "]<br><br>"

	u.forEach((el,i,self)=>{
		let check = 0
		for(let j = 0; j < table.length; j++){
			for(let k = 1; k < table[j].length; k++){
				if(self[i].localeCompare(table[j][k])==0){
					check = 1
					returnDiv.innerHTML += (self[i] + " - изпратена дума: " + getSendWord(self[i],table[j][0]))
					returnDiv.innerHTML += " с грешка: "
					returnDiv.innerHTML += table[j][0]
					returnDiv.innerHTML += "<br>"
				}

			}
		}
		if(check == 0){
			returnDiv.innerHTML += self[i]
			returnDiv.innerHTML += " - думата не е открита <br>"

		}
	})	
})


let getK = function(arr){
	return arr.length
}

let getN = function(arr){
	return arr[1].length
}

let inputToMatrix = function(matrix){
	let arr = matrix.split("\n")
	let arr1 = []
	arr.forEach((item, i) =>{
			arr1[i] = item.split(/\s*[\s,]\s*/)
		i++
	})
	arr1.forEach(item =>{
		item.forEach( (item, i, self) => self[i] = Number(item))
	})
	return arr1
}

let getCodeWords = function (arr){
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

let BinaryAdditionSimple = function(arr1,arr2){
	let answer = []
	let length = arr1.length - 1
	for(let i = 0; i <= length; i++ ){
		if(arr1[i] == 0 && arr2[i] == 0) answer[i] = 0;
		if(arr1[i] == 1 && arr2[i] == 0) answer[i] = 1;
		if(arr1[i] == 0 && arr2[i] == 1) answer[i] = 1;
		if(arr1[i] == 1 && arr2[i] == 1) answer[i] = 0;
	}
	return answer
}
let BinaryAdditionComplex = function(arr){
	let answer = []
	let temp = zeroWord(arr[0].length)
	arr.forEach(item =>{
		 temp = BinaryAdditionSimple(item,temp)
	})
	return temp
}


let stringToInt = function(num){
	num = Number(num)
}

let getCombinations = function(arr){
	let combinations = []
	for(let i = 0; i < getK(arr);i++){
		combinations.push(i);
	}
	return combinations
}

let combine = function(a, min) {
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

let zeroWord = function(x){
	let z = [];
	for(let i = 0; i <= x; i++){z.push(0)}
	return z;
}

let findError = function(words){
	let w  = 0
	let d = 99999
	let errorVectors = []
	let errorCombinations = []
	words.forEach(word => {
		word.forEach(symbol =>{
			if(symbol == 1) w++;
		})
		if(w < d && w != 0) d = w;
		w = 0
	})
	let t = (d+1)/2
	console.log(t)
	if(t % 1 == 0) {
		t = t-1}
	if(t % 1 != 0) {
		t = Math.floor(t)
	}
	returnDiv.innerHTML += ("Брой грешки, които кодът поправя: " + t +"<br><br>")
	let errorVectorLength = words[0].length - 1
	for(let i = 0; i <= errorVectorLength; i++){
		errorCombinations.push(i)
	}
	err = combine(errorCombinations,1);
	for(let i = err.length - 1; i >= 0; i--){
		if (err[i].length > t){
			err.pop()
		}
	}

	for(let i = 0; i < err.length; i++){
		errorVectors.push(zeroWord(errorVectorLength))
	}

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
	
	for(let i = 1; i < table.length; i++){
		for(let j = 1; j < words.length; j++){
			table[i][j] = BinaryAdditionSimple(errorVectors[i-1],words[j])
		}
	}
	return table
}

let tableToString = function(table){
	for(i = 0; i < table.length; i++){
		for(j = 0; j < table[i].length; j++){
			table[i][j] = table[i][j].join('')
		}
	}
}

let createTable = function (tableData) {
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
  document.getElementById("tblDiv").appendChild(table)
}

let validate = function(arr1,arr2){
	arr1.forEach(el=>{
		if(el.length != arr1[0].length) alert("Дължините на редовете в матрицата G се различават.");
	})
	arr2.forEach(el=>{
		if(el.length != arr2[0].length) alert("Дължините на думите U се различават.");
	})
	if (arr2.length > 1 ){
	arr1.forEach((el,i) =>{
		if(el.length != arr2[0].length) alert("Дължината на думите U не отговаря на матрицата G.");
	})}else{
		if(arr2[0].length != arr1[0].length) alert("Дължината на думите U не отговаря на матрицата G.");
	}
}

let getSendWord = function(word, err){
	arrayWord = word.split("")
	errAray = err.split("")
	let answer = BinaryAdditionSimple(word,err)
	answer = answer.join('')
	return answer

}
