import {cloneDeep} from '@/utils/miniLodash'
import { mescrollDefaultConfig } from '@/constants/mescroll.js'

export * from './apiUtils'
export * from './carRentalUtils'
import * as orderUtils from './orderUtils'
export * from './carRentalUtils/orderList'

export { orderUtils }

// 计算两点之间的距离
export function calculateDistance(start, end) {
  var d1 = 0.01745329251994329;
  var d2 = start.lng || start.longitude
  var d3 = start.lat || start.latitude
  var d4 = end.lng || end.longitude
  var d5 = end.lat || end.latitude
  d2 *= d1;
  d3 *= d1;
  d4 *= d1;
  d5 *= d1;
  var d6 = Math.sin(d2);
  var d7 = Math.sin(d3);
  var d8 = Math.cos(d2);
  var d9 = Math.cos(d3);
  var d10 = Math.sin(d4);
  var d11 = Math.sin(d5);
  var d12 = Math.cos(d4);
  var d13 = Math.cos(d5);
  var arrayOfDouble1 = [];
  var arrayOfDouble2 = [];
  arrayOfDouble1.push(d9 * d8);
  arrayOfDouble1.push(d9 * d6);
  arrayOfDouble1.push(d7);
  arrayOfDouble2.push(d13 * d12);
  arrayOfDouble2.push(d13 * d10);
  arrayOfDouble2.push(d11);
  var d14 = Math.sqrt((arrayOfDouble1[0] - arrayOfDouble2[0]) * (arrayOfDouble1[0] - arrayOfDouble2[0]) +
      (arrayOfDouble1[1] - arrayOfDouble2[1]) * (arrayOfDouble1[1] - arrayOfDouble2[1]) +
      (arrayOfDouble1[2] - arrayOfDouble2[2]) * (arrayOfDouble1[2] - arrayOfDouble2[2]));

  return Math.floor((Math.asin(d14 / 2.0) * 12742001.579854401))
}

// 获取年月日 
export function relativeDate (type = 1,dot=1,next, customDate) {
  let date = customDate || new Date();
  let y = date.getFullYear();
  let m = date.getMonth() + 1;
  let d = date.getDate();
	if(next){
		y = y+next;
	};
  m = m >= 10 ? m : '0' + m;
  d = d >= 10 ? d : '0' + d;
  if (type == 1) {
		if(dot == 1){
			return `${y}-${m}-${d}`
		} else {
			return `${y}.${m}.${d}`
		}
  }
  let h = date.getHours()
  let min = date.getMinutes()
  let s = date.getSeconds()
  h = h >= 10 ? h : '0' + h
  min = min >= 10 ? min : '0' + min
  s = s >= 10 ? s : '0' + s
  return `${y}-${m}-${d} ${h}:${min}:${s}`
}
// 时间戳转时间 
export function formatTime (time) {
  const dt = new Date(time);
	const y = dt.getFullYear();
	const m = (dt.getMonth() + 1 + '').padStart(2, '0');
	const d = (dt.getDate() + '').padStart(2, '0');
	const hh = (dt.getHours() + '').padStart(2, '0');
	const mm = (dt.getMinutes() + '').padStart(2, '0');
	const ss = (dt.getSeconds() + '').padStart(2, '0');

	return `${y}/${m}/${d} ${hh}:${mm}:${ss}`
}
export function debounce(func, wait, immediate) {
  let timeout, args, context, timestamp, result
  
  const later = function() {
    // 据上一次触发时间间隔
    const last = +new Date() - timestamp

    // 上次被包装函数被调用时间间隔last小于设定时间间隔wait
    if (last < wait && last > 0) {
      timeout = setTimeout(later, wait - last)
    } else {
      timeout = null
      // 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
      if (!immediate) {
        result = func.apply(context, args)
        if (!timeout) context = args = null
      }
    }
  }

  return function(...args) {
    context = this
    timestamp = +new Date()
    const callNow = immediate && !timeout
    // 如果延时不存在，重新设定延时
    if (!timeout) timeout = setTimeout(later, wait)
    if (callNow) {
      result = func.apply(context, args)
      context = args = null
    }

    return result
  }
}

// date string to timeStamp
export function isValidTime (start, end) {

  start = new Date(`1970-10-01 ${start}`).getTime()
  end = new Date(`1970-10-01 ${end}`).getTime()
  let dis = Math.floor((end - start) / 1000)

  // 结束时间 少于开始时间一个小时 不合法
  if (dis < 3600) {
    return false 
  } 
  return true

}
//计算时长
export function duration (ctime,outTime) {
  var date1=new Date(ctime.replace(/-/g, "/"));  //开始时间
  var date2=new Date(outTime.replace(/-/g, "/"));    //结束时间  
  var date3=date2.getTime()-date1.getTime()  //时间差的毫秒数
  //计算出相差天数  
  var days=Math.floor(date3/(24*3600*1000))     
  //计算出小时数  
  var leave1=date3%(24*3600*1000)    //计算天数后剩余的毫秒数  
  var hours=Math.floor(leave1/(3600*1000))  
  //计算相差分钟数  
  var leave2=leave1%(3600*1000)        //计算小时数后剩余的毫秒数  
  var minutes=Math.floor(leave2/(60*1000))  
  //计算相差秒数  
  var leave3=leave2%(60*1000)      //计算分钟数后剩余的毫秒数  
  var seconds=Math.round(leave3/1000)
  if(days==0&&hours!=0){
    return hours+"小时"+minutes+"分钟"
  }else if(days==0&&hours==0){
    return minutes+"分钟"
  }else if(days!=0){
    return days+"天 "+hours+"小时"+minutes+"分钟"
  }  
};
//计算时长
export function duration1 (ctime,outTime,type) {
  var date1=new Date(ctime.replace(/-/g, "/"));  //开始时间
  var time1 = Date.parse(date1)
  // if(outTime){
	 //   var date2=new Date(outTime.replace(/-/g, "/"));    //结束时间  
  // }else{
	 //   var date2=new Date();    //结束时间  
  // }
	if(type == 1){
		var date2=new Date(outTime.replace(/-/g, "/"));    //结束时间
	} else if(type == 2){
		var date2 = new Date(outTime);
	}
  var time2 = Date.parse(date2)
  var diffTime = (time2-time1)/1000;
  var h = Math.floor(diffTime/3600)
  var m = Math.floor((diffTime%3600)/60)
  var s = Math.floor(diffTime%60)
  return{
	 h : h >= 10 ? h : '0' + h,
	 m : m >= 10 ? m : '0' + m,
	 s : s >= 10 ? s : '0' + s
  }
};
//浮点数加法
export function accAdd(arg1,arg2){
  var r1,r2,m;
  try{r1=arg1.toString().split(".")[1].length}catch(e){r1=0};
  try{r2=arg2.toString().split(".")[1].length}catch(e){r2=0};
  m=Math.pow(10,Math.max(r1,r2));
  return (arg1*m+arg2*m)/m;
};
//浮点数乘法
export function accMul(arg1,arg2){
  var m=0,s1=arg1.toString(),s2=arg2.toString();
  try{m+=s1.split(".")[1].length}catch(e){}
  try{m+=s2.split(".")[1].length}catch(e){}
  return Number(s1.replace(".",""))*Number(s2.replace(".",""))/Math.pow(10,m)
};
//浮点数减法
export function accSubtr(arg1,arg2){
	var r1,r2,m,n;
	try{r1=arg1.toString().split(".")[1].length;}catch(e){r1=0;}
	try{r2=arg2.toString().split(".")[1].length;}catch(e){r2=0;}
	m=Math.pow(10,Math.max(r1,r2));
	//动态控制精度长度
	n=(r1>=r2)?r1:r2;
	return ((arg1*m-arg2*m)/m).toFixed(n);
};
// 保留两位小数，第三位舍去
export function toFixed2(num){
	num += '';  // 数字转字符串
	if(num.indexOf('.')>0){
		if(num.length - num.indexOf('.') > 3){
			num = num.substring(0,num.indexOf('.')+3);
		} else if(num.length - num.indexOf('.') == 2){
			num += '0';
		}
	} else {
		num += '.00';
	}
	return num
}
// 保留八位小数，第九位舍去
export function toFixed8(num){
	num += '';  // 数字转字符串
	if(num.indexOf('.')>0){
		if(num.length - num.indexOf('.') > 9){
			num = num.substring(0,num.indexOf('.')+9);
		} else if(num.length - num.indexOf('.') == 8){
			num += '0';
		}
	} else {
		num += '.00000000';
	}
	return num
}
// 无牌车车牌号
export function dealCarNumber(carNumber) {
	// return '无HS8S32（无牌车）';
	if (carNumber && carNumber.slice(0, 1) == '无') {
		return carNumber + '（无牌车）';
	}
	return carNumber;
}

export const formatDistance = (distance) => {
	if (typeof distance == 'string' && distance.indexOf('m')) {
		return distance
	}
	return distance && distance>=1000?(distance/1000).toFixed(2)+'km':distance.toFixed(0)+'m'
}


export const getMescrollConfig = (configFn) => {
	if (typeof configFn === 'function') {
		return configFn(cloneDeep(mescrollDefaultConfig))
	} else {
		return cloneDeep(mescrollDefaultConfig)
	}
	
}

//浮点数除法
// export function accDivCoupon(arg1,arg2){
// 	var t1=0,t2=0,r1,r2;
// 	try{t1=arg1.toString().split(".")[1].length;}catch(e){}
// 	try{t2=arg2.toString().split(".")[1].length;}catch(e){}
// 	with(Math){
// 		r1=Number(arg1.toString().replace(".",""));
// 		r2=Number(arg2.toString().replace(".",""));
// 		return (r1/r2)*pow(10,t2-t1);
// 	}
// };