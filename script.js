var extract = [];
if (localStorage.getItem("extract")) {
  extract = JSON.parse(localStorage.getItem("extract"));
}
function extractHTML() {
  var total = 0;
  let result;
  let extract = JSON.parse(localStorage.getItem("extract"));
  let table = document.querySelector("#table tbody");
  
  if(extract.length == 0) {
    table.innerHTML = `
    <tr class="message_information">
    <td class="message"> Nenhuma transação cadastrada</td>
    </tr>`
  }
  if(extract.length !== 0) {
    table.innerHTML = extract.map((extract) => {
    return (
      ` <tr class="price">
        <td class="price_simbol simbol">+</td>
        <td class="price_simbol">`+ extract.nomeMercadoria + `</td>
        <td class="price_simbol">${formatterCurrency(Number(extract.valorMercadoria))}</td>
      </tr> `
    )
  }).join('');
  for (i = 0; i < extract.length; i++) {
    if (extract[i].selecaoMercadoria == "compra") {
      document.getElementsByClassName("simbol")[i].innerHTML = "-";
    } else{
      document.getElementsByClassName("simbol")[i].innerHTML = "+";
    }
  }
  for(item in extract) {
    if (extract[item].selecaoMercadoria == "compra") {
      result = extract[item];
      total -= Number(extract[item].valorMercadoria);
    } else {
      total += Number(extract[item].valorMercadoria);
    }
  }
  if(extract.length > 0) {
    document.querySelector("#table tfoot").innerHTML = `
      <tr class="total">
      <td>Total</td>
      <td>${formatter.format(total)}</td>
      </tr> `
      document.querySelector("#table tfoot").innerHTML += `
      <tr>
      <td class="result">${Math.sign(total) > 0 ? "[LUCRO]" : "[PREJUÍZO]"}</td>
      </tr> `
    }
  }
}

  function formatterCurrency(value) {
    const valueFormat = value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
    return valueFormat;
  }
  var formatter = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 2,
  });

  function validateMask(objTextBox, SeparadorMilesimo, SeparadorDecimal, e){  
    var sep = 0;  
    var key = '';  
    var i = j = 0;  
    var len = len2 = 0;  
    var strCheck = '0123456789';  
    var aux = aux2 = '';  
    var whichCode = (window.Event) ? e.which : e.keyCode;  
    if (whichCode == 13 || whichCode == 8) return true;  
    key = String.fromCharCode(whichCode); // Valor para o código da Chave  
    if (strCheck.indexOf(key) == -1) return false; // Chave inválida  
    len = objTextBox.value.length;  
    for(i = 0; i < len; i++)  
        if ((objTextBox.value.charAt(i) != '0') && (objTextBox.value.charAt(i) != SeparadorDecimal)) break;  
    aux = '';  
    for(; i < len; i++)  
        if (strCheck.indexOf(objTextBox.value.charAt(i))!=-1) aux += objTextBox.value.charAt(i);  
    aux += key;  
    len = aux.length;  
    if (len == 0) objTextBox.value = '';  
    if (len == 1) objTextBox.value = '0'+ SeparadorDecimal + '0' + aux;  
    if (len == 2) objTextBox.value = '0'+ SeparadorDecimal + aux;  
    if (len > 2) {  
      aux2 = '';  
      for (j = 0, i = len - 3; i >= 0; i--) {  
        if (j == 3) {  
          aux2 += SeparadorMilesimo;  
          j = 0;  
        }  
        aux2 += aux.charAt(i);  
        j++;  
      }  
      objTextBox.value = '';  
      len2 = aux2.length;  
      for (i = len2 - 1; i >= 0; i--)  
        objTextBox.value += aux2.charAt(i);  
        objTextBox.value += SeparadorDecimal + aux.substr(len - 2, len);  
      }  
      return false;  
    } 

    function deletaLocalStorage() {
      let mercadorias = document.querySelectorAll('.price')
      let totais = document.querySelectorAll('.total')
      let status = document.querySelectorAll('.result')
      if (confirm("Deseja remover os dados da table?")) {
        mercadorias.forEach((element) => {
        element.remove();
      })
      totais.forEach((element) => {
        element.remove();
      })
      status.forEach((element) => {
        element.remove();
      })
      extract = []
      localStorage.setItem('extract', JSON.stringify(extract))
      alert("Transações excluídas");
    }else{
      alert("Exclusões canceladas");
    }
    extractHTML()
  }
  let linkExcluir = document.getElementById("clear");
  linkExcluir.addEventListener("click", deletaLocalStorage)

function addTransaction(event) {
  event.preventDefault();
  var release = document.getElementById("release").value;
  var merchandise = document.getElementById("add_merchandise").value;
  var price = document.getElementById("valor").value;
  
  if(merchandise == "") {
    alert("Preencha o nome da mercadoria");
    document.getElementById("add_merchandise").focus();
    return false;
  }
  if(price == "") {
    alert("Preencha o valor");
    document.getElementById("valor").focus();
    return false;
  }
  extract.push(
    {
      "selecaoMercadoria": release,
      "nomeMercadoria": merchandise,
      "valorMercadoria": price
      .replaceAll(".", "")
      .replaceAll(",", "."),
    }
  );
  let extractString = JSON.stringify(extract);
  localStorage.setItem("extract", extractString);
  extractHTML();
  event.target.reset()
}
