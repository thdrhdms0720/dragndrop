// app.js
var product;
var itemNumber = [];

$(function() { 
	$.ajax({
		url: "data/products.json",
		dataType: "json",
		success: function(data) {
			product = data;
			$(data).each(function(e, el) {
				var html = "";
					html += "<div class='product' data-id='"+data[e].id+"'>";
						html += "<p class='product-name'>"+data[e].product+"</p>";
						html += "<p class='product-price'>"+data[e].price+"</p>";
						html += "<p class='product-detail'>"+data[e].detail+"</p>";
						html += "<p class='product-btns'>";
						html += "	<button class='btn btn-warning btn-sm'><span class='glyphicon glyphicon-trash'></button>";
						html += "</p>";
					html += "</div>";
				$('#productsbox').append(html);
			});
		}
	});

	$("body").on("mouseover",".product",function(){ //드래그
		$(this).draggable({
			helper: "clone"
		});	
	});	

	$("#cartbox").droppable({ //드롭
		drop : function( event, ui ) {
			var dropItem = $(ui.draggable);
			var dropNo = $(dropItem).attr("data-id");
			
			if(itemNumber[dropNo] == "" || itemNumber[dropNo] == null) {
				itemNumber[dropNo] = 1;
			} else {
				itemNumber[dropNo] = itemNumber[dropNo] + 1;
			}
			
			var item = product[dropNo - 1];
			var itemId = item.id;
			var itemName = item.product;
			var itemDetail = item.detail;
			var itemPrice = item.price.replace(",", "");
			var itemNo = itemNumber[dropNo];
			
			var tr = "<tr>";
			tr += "<td id='proid' data-id='"+itemId+"'>"+itemId+"</td>";
			tr += "<td id='proname'>"+itemName+"</td>";
			tr += "<td id='prodetail'>"+itemDetail+"</td>";
			tr += "<td id='proprice'>"+comma(itemPrice)+"</td>";
			tr += "<td id='procount'>"+itemNo+"</td>";
			tr += "<td id='proetc'>"+comma(itemPrice)+" * "+itemNo+"</td>";
			tr += "<td><button class='prodel btn btn-warning'>상품 취소</button></td>"
			tr += "</tr>";
			
			if(itemNo == 1) { $(".itemTable tbody").append(tr); $('#remove').remove(); }
			else {
				var editItem = $(".itemTable tbody").find("td[data-id='"+itemId+"']");
				$(editItem).siblings("td#proprice").text(comma(itemNo * Number(itemPrice)));
				$(editItem).siblings("td#procount").text(itemNo);
				$(editItem).siblings("td#proetc").text(comma(itemPrice)+" * "+itemNo);
			}
			
			pricing();
		}
	});
});

function pricing() { //가격
	var price = 0;
	$(".itemTable tr").each(function(e, el) {
		price += Number($(el).find("td#proprice").text().replace(",", ""));
	});
	
	$("#total").text(comma(price)+"원");
}

function comma(a) { //세자릿수 콤마
	var a = String(a);
	var len = a.length;
	var arr = [];
	
	if(len % 3 != 0) {
		arr.push(a.substr(0, len%3));
		a = a.substr(len%3);
	}
	
	var no = a.length / 3;
	
	for(var i=0; i<no; i++) {
		arr.push(a.substr(0, 3));
		a = a.substr(3)
	}
	return arr.join(",");
}

$('body').on("click", '.prodel', function() { //삭제
	var dropnos = $(this).parent('td').siblings('td:first-child').attr('data-id');
	itemNumber[dropnos] = "";
	$(this).parent('td').parent('tr').remove();
	pricing();
});