//创建一个Map集合类
function Map() {
	var obj = {}; //空对象，存放键值对

	//put方法，存值
	this.put = function(key, value) {
		obj[key] = value;
	}

	//size方法，返回大小
	this.size = function() {
		var count = 0;
		for(var att in obj) {
			count++;
		}
		return count;
	}

	//get方法，根据key获得value
	this.get = function(key) {
		if(obj[key] || obj[key] === 0 || obj[key] === false) {
			return obj[key];
		} else {
			return null;
		}
	}

	//删除方法，根据key删除
	this.remove = function(key) {
		if(obj[key] || obj[key] === 0 || obj[key] === false) {
			delete obj[key];
		}
	}

	//遍历map
	this.each = function(fn) {
		for(var att in obj) {
			fn(att, obj[att]);
		}
	}
}

//select选中事件
function isShow() {
	var input = document.getElementById("label");
	var select = document.getElementById("isadd");
	var index = select.selectedIndex;
	var selectedValue = select.options[index].value;
	if(selectedValue == "yes") {
		document.getElementById("label").style.visibility = "visible";
		document.getElementById("label").value = "";
	}
	if(selectedValue == "no") {
		document.getElementById("label").style.visibility = "hidden";
		document.getElementById("label").value = "";
	}
}

//创建一个变量代表tasknumber
tasknumber = 0;
//创建一个数据仓库变量存储Tudo相关数据
datamap = new Map();

//创建一个任务箱仓库变量和一个临时任务箱变量,以及一个标签任务列表
taskmap = new Map();
tempmap = new Map();
labelmap = new Map();

//显示输入Tudo区
function showtask() {
	var div = document.getElementById("addtudo");
	div.style.visibility = "visible"
	if(document.getElementById("isadd").options[document.getElementById("isadd").selectedIndex].value == "yes") {
		document.getElementById("label").style.visibility = "visible";
	}
}
//关闭输入Tudo区
function closetask() {
	var div = document.getElementById("addtudo");
	div.style.visibility = "hidden"
	document.getElementById("label").style.visibility = "hidden";
}

//创建一个数据集装箱
function DataContainer(tasknumber, name, description, isadd, label, time) {
	this.tasknumber = tasknumber;
	this.name = name;
	this.description = description;
	this.isadd = isadd;
	this.label = label;
	this.time = time;
}

//得到Tudo相关数据
function getTudo() {

	var select = document.getElementById("isadd");
	var index = select.selectedIndex;
	var selectedValue = select.options[index].value;

	tasknumber++;
	var tudoname = document.getElementById("tudoname").value;
	var tudodecription = document.getElementById("tudodescription").value;
	var isadd = selectedValue;
	var label = document.getElementById("label").value;
	var finish = document.getElementById("finishtime");
	var finishindex = finish.selectedIndex;
	var time = finish.options[finishindex].value;
	var data = new DataContainer(tasknumber, tudoname, tudodecription, isadd, label, time);
	datamap.put(data.tasknumber, data);
	synchronizeall();
}
//model层处理完毕

//开始分发数据

/*
 * 创建一个filter按照时间来区分任务箱和临时任务箱，
 * 然后按是否有标签区别标签任务
 */

function filter() {

	datamap.each(function(key, value) {
		if(value.time == "--") {
			//说明属于临时任务箱
			tempmap.put(value.tasknumber, value);
		} else {
			//说明属于任务箱
			taskmap.put(value.tasknumber, value);
		}
		if(value.isadd == "yes"&&value.label!="") {
			
			labelmap.put(value.tasknumber, value);
		}

	});
}

function taskmapcluster() {
	var temptaskmaptoday = new Map();
	var temptaskmaptomorrow = new Map();
	var temptaskmapfuture = new Map();
	taskmap.each(function(key, value) {
		if(value.time == "今日待办") {
			temptaskmaptoday.put(value.tasknumber, value);
		}
		if(value.time == "明日待办") {
			temptaskmaptomorrow.put(value.tasknumber, value);
		}
		if(value.time == "未来") {
			temptaskmapfuture.put(value.tasknumber, value);
		}
	});
	var array = new Map();
	array.put("temptaskmaptoday", temptaskmaptoday);
	array.put("temptaskmaptomorrow", temptaskmaptomorrow);
	array.put("temptaskmapfuture", temptaskmapfuture);
	return array;
}

function flush() {
	taskmap = new Map();
	tempmap = new Map();
	labelmap = new Map();
	var div1 = document.getElementById("taskcase");
	div1.innerHTML = "";

}

function taskonedelete1(temp) {
	datamap.remove(temp.tempvalue.tasknumber);
	synchronize();
	synchronizelabel();
	//		    console.temp.button1.innerHTML;
}

function taskonedelete2(temp) {
	datamap.remove(temp.tempvalue.tasknumber);
	temp.tempvalue.time = "--";
	datamap.put(temp.tempvalue.tasknumber, temp.tempvalue);
	synchronize();
	synchronizetemp();
	synchronizelabel()
}

function synchronize() {
	flush();
	filter();
	var array = taskmapcluster();
	var divtask = document.getElementById("taskcase");

	array.get("temptaskmaptoday").each(function(key, value) {
		var temp = new createtaskelement(value);

		temp.button1.onclick = function() {
			taskonedelete1(temp);
		}
		temp.button2.onclick = function() {
			taskonedelete2(temp);
		}
		divtask.appendChild(temp.returndiv());
	});
	array.get("temptaskmaptomorrow").each(function(key, value) {
		var temp = new createtaskelement(value);

		temp.button1.onclick = function() {
			taskonedelete1(temp);
		}
		temp.button2.onclick = function() {
			taskonedelete2(temp);
		}
		divtask.appendChild(temp.returndiv());
	});
	array.get("temptaskmapfuture").each(function(key, value) {
		var temp = new createtaskelement(value);

		temp.button1.onclick = function() {
			taskonedelete1(temp);
		}
		temp.button2.onclick = function() {
			taskonedelete2(temp);
		}
		divtask.appendChild(temp.returndiv());
	});
}

//创建任务箱tuto子元素
function createtaskelement(value) {

	this.tempvalue = value;
	this.div = document.createElement("div");
	this.h1 = document.createElement("h1");
	this.h1.innerHTML = value.name;
	this.p = document.createElement("p");
	this.p.innerHTML = value.description;
	this.a1 = document.createElement("a");
	this.a1.innerHTML = "标签:";
	this.label = document.createElement("label");
	this.label.innerHTML = value.label;
	this.br1 = document.createElement("br");
	this.a2 = document.createElement("a");
	this.a2.innerHTML = "时间:";
	this.time = document.createElement("time");
	this.time.innerHTML = value.time;
	this.br2 = document.createElement("br");

	this.button1 = document.createElement("button");
	this.button1.innerHTML = "删除任务";

	this.button2 = document.createElement("button");
	this.button2.innerHTML = "删除时间信息";
	
	this.br3=document.createElement("br");
	
	this.hr=document.createElement("hr");

	this.returndiv = function() {
		this.div.appendChild(this.h1);
		this.div.appendChild(this.p);
		this.div.appendChild(this.a1);
		this.div.appendChild(this.label);
		this.div.appendChild(this.br1);
		this.div.appendChild(this.a2);
		this.div.appendChild(this.time);
		this.div.appendChild(this.br2);
		this.div.appendChild(this.button1);
		this.div.appendChild(this.button2);
		this.div.appendChild(this.br3);
		this.div.appendChild(this.hr);
		return this.div;
	}

}

//temptask
//创建临时任务箱
function createtemptaskelement(value) {

	this.tempvalue = value;
	this.div = document.createElement("div");
	this.h1 = document.createElement("h1");
	this.h1.innerHTML = value.name;
	this.p = document.createElement("p");
	this.p.innerHTML = value.description;
	this.a1 = document.createElement("a");
	this.a1.innerHTML = "标签:";
	this.label = document.createElement("label");
	this.label.innerHTML = value.label;
	this.br1 = document.createElement("br");
	this.a2 = document.createElement("a");
	this.a2.innerHTML = "时间:";
	this.time = document.createElement("time");
	this.time.innerHTML = value.time;
	this.br2 = document.createElement("br");

	this.button1 = document.createElement("button");
	this.button1.innerHTML = "删除临时任务";

	this.button2 = document.createElement("button");
	this.button2.innerHTML = "添加时间信息";
	this.select = document.createElement("select");
	this.option1 = document.createElement("option");
	this.option1.innerHTML = "今日待办"
	this.option2 = document.createElement("option");
	this.option2.innerHTML = "明日待办";
	this.option3 = document.createElement("option");
	this.option3.innerHTML = "未来";
	this.option4 = document.createElement("option");
	this.option4.innerHTML = "--";
	this.select.appendChild(this.option1);
	this.select.appendChild(this.option2);
	this.select.appendChild(this.option3);
	this.select.appendChild(this.option4);
	
	this.br3=document.createElement("br");
	
	this.hr=document.createElement("hr");

	this.returndiv = function() {
		this.div.appendChild(this.h1);
		this.div.appendChild(this.p);
		this.div.appendChild(this.a1);
		this.div.appendChild(this.label);
		this.div.appendChild(this.br1);
		this.div.appendChild(this.a2);
		this.div.appendChild(this.time);
		this.div.appendChild(this.br2);
		this.div.appendChild(this.button1);
		this.div.appendChild(this.button2);
		this.div.appendChild(this.select);
		this.div.appendChild(this.br3);
		this.div.appendChild(this.hr);

		return this.div;
	}

}

//刷新临时任务列表
function flushtemp() {
	taskmap = new Map();
	tempmap = new Map();
	labelmap = new Map();
	var div1 = document.getElementById("temptaskcase");
	div1.innerHTML = "";

}

//同步临时任务列表
function synchronizetemp() {
	flushtemp();
	filter();
	var divtemptask = document.getElementById("temptaskcase");

	tempmap.each(function(key, value) {
		var temp = new createtemptaskelement(value);

		temp.button1.onclick = function() {
			temptaskonedelete1(temp);
		}
		temp.button2.onclick = function() {
			var tempthis = this;
			temptaskoneaddtime2(temp, tempthis);
		}
		divtemptask.appendChild(temp.returndiv());
	});

}
//temptaskbutton1 delete
function temptaskonedelete1(temp) {
	datamap.remove(temp.tempvalue.tasknumber);
	synchronizetemp();
	synchronizelabel();
}

//temptaskbutton2 addtime
function temptaskoneaddtime2(temp, tempthis) {
	var select = tempthis.parentNode.getElementsByTagName("select")[0];
	var selectedindex = select.selectedIndex;
	var modifyvalue = select.options[selectedindex].text;
	if(modifyvalue == "--") {

	} else {
		var value = datamap.get(temp.tempvalue.tasknumber);

		datamap.remove(temp.tempvalue.tasknumber);

		value.time = modifyvalue;
		datamap.put(value.tasknumber, value);
		synchronizetemp();
		synchronize();
		synchronizelabel();
	}

}

//labeltask
//创建标签任务列表
function createlabeltaskelement(value) {

	this.tempvalue = value;
	this.div = document.createElement("div");
	this.h1 = document.createElement("h1");
	this.h1.innerHTML = value.name;
	this.p = document.createElement("p");
	this.p.innerHTML = value.description;
	this.a1 = document.createElement("a");
	this.a1.innerHTML = "标签:";
	this.label = document.createElement("label");
	this.label.innerHTML = value.label;
	this.br1 = document.createElement("br");
	this.a2 = document.createElement("a");
	this.a2.innerHTML = "时间:";
	this.time = document.createElement("time");
	this.time.innerHTML = value.time;
	this.br2 = document.createElement("br");

	this.button1 = document.createElement("button");
	this.button1.innerHTML = "删除任务";

	this.button2 = document.createElement("button");
	this.button2.innerHTML = "删除标签";

	this.br3=document.createElement("br");
	
	this.hr=document.createElement("hr");


	this.returndiv = function() {
		this.div.appendChild(this.h1);
		this.div.appendChild(this.p);
		this.div.appendChild(this.a1);
		this.div.appendChild(this.label);
		this.div.appendChild(this.br1);
		this.div.appendChild(this.a2);
		this.div.appendChild(this.time);
		this.div.appendChild(this.br2);
		this.div.appendChild(this.button1);
		this.div.appendChild(this.button2);
		this.div.appendChild(this.br3);
		this.div.appendChild(this.hr);
	
		return this.div;
	}

}

//刷新任务列表
function flushlabel() {
	taskmap = new Map();
	tempmap = new Map();
	labelmap = new Map();
	var div1 = document.getElementById("labeltaskcase");
	div1.innerHTML = "";

}

//同步标签任务列表
function synchronizelabel() {
	flushlabel();
	filter();
	var divlabeltask = document.getElementById("labeltaskcase");
	var array = labelmapcluster();
	array.get("labeltaskmapstudy").each(function(key, value) {
		var temp = new createlabeltaskelement(value);

		temp.button1.onclick = function() {
			labeltaskonedelete1(temp);
		}
		temp.button2.onclick = function() {
			labeltasktwodelete2(temp);
		}
		divlabeltask.appendChild(temp.returndiv());
	});
	array.get("labeltaskmapwork").each(function(key, value) {
		var temp = new createlabeltaskelement(value);

		temp.button1.onclick = function() {
			labeltaskonedelete1(temp);
		}
		temp.button2.onclick = function() {
			labeltasktwodelete2(temp);
		}
		divlabeltask.appendChild(temp.returndiv());
	});
	array.get("labeltaskmapentertainment").each(function(key, value) {
		var temp = new createlabeltaskelement(value);

		temp.button1.onclick = function() {
			labeltaskonedelete1(temp);
		}
		temp.button2.onclick = function() {
			labeltasktwodelete2(temp);
		}
		divlabeltask.appendChild(temp.returndiv());
	});
	array.get("labelother").each(function(key, value) {
		var temp = new createlabeltaskelement(value);

		temp.button1.onclick = function() {
			labeltaskonedelete1(temp);
		}
		temp.button2.onclick = function() {
			labeltasktwodelete2(temp);
		}
		divlabeltask.appendChild(temp.returndiv());
	});

}

//labeltaskbutton1 delete
function labeltaskonedelete1(temp) {
	datamap.remove(temp.tempvalue.tasknumber);
	synchronizelabel();
	synchronize();
	synchronizetemp();
}
//labeltaskbutton2 delete
function labeltasktwodelete2(temp) {
	var value = datamap.get(temp.tempvalue.tasknumber);
	datamap.remove(value.tasknumber);
	value.label = "";
	datamap.put(value.tasknumber,value);
	synchronizelabel();
	synchronize();
	synchronizetemp();

}

//标签聚类
function labelmapcluster() {
	var labeltaskmapstudy = new Map();
	var labeltaskmapwork = new Map();
	var labeltaskmapentertainment = new Map();
	var labelother = new Map();
	labelmap.each(function(key, value) {
		if(value.label == "学习") {
			labeltaskmapstudy.put(value.tasknumber, value);
		} else if(value.label == "工作") {
			labeltaskmapwork.put(value.tasknumber, value);
		} else if(value.label == "娱乐") {
			labeltaskmapentertainment.put(value.tasknumber, value);
		} else {
			labelother.put(value.tasknumber, value);
		}
	});
	var array = new Map();
	array.put("labeltaskmapstudy", labeltaskmapstudy);
	array.put("labeltaskmapwork", labeltaskmapwork);
	array.put("labeltaskmapentertainment", labeltaskmapentertainment);
	array.put("labelother", labelother);
	return array;
}

function synchronizeall() {
	synchronize();
	synchronizetemp()
	synchronizelabel();

}

//勿在浮沙筑高台