let propertiesLi=document.getElementById('sidebar-quicklinks').getElementsByTagName("ol")[0].childNodes[15].getElementsByTagName('ol')[0].childNodes;
let NProps=[];
let EProps=[];
let DProps=[];
for(let item of propertiesLi){
	
	let icons=item.getElementsByTagName("svg");
	
	if(icons.length>0){
		//icon-deprecated
		//icon-experimental
		for(let index=0;index<icons.length;index++){
			if(icons[index].classList.contains("icon-experimental")){
				EProps.push({
					name:item.getElementsByTagName("a")[0].innerText,
					url:item.getElementsByTagName("a")[0].href,
				});
			}
			if(icons[index].classList.contains("icon-deprecated")){
				DProps.push({
					name:item.getElementsByTagName("a")[0].innerText,
					url:item.getElementsByTagName("a")[0].href,
				});
			}
		}
	}else{
		NProps.push({
			name:item.getElementsByTagName("a")[0].innerText,
			url:item.getElementsByTagName("a")[0].href,
		});
	}
}


let getProps = (element, event) => {

    return new Promise( function(resolve){
        let handler = () => {
            resolve();
            element.removeEventListener(event, handler);
        }
        element.addEventListener(event, handler);
    })
}


let win=null;

void async function () {
    let props = [];
    for (let prop of NProps) { 

        //MDN网站的网页设置 X-Frame-Options为deny，所以无法使用网页加载至iframe，故使用open操作
        if (win) { 
            win.close();
        }
        win = window.open(prop.url);

        await getProps(win, "load");

        console.log(win);

        let ptemp = win.document.getElementById('content').getElementsByTagName('p')[0];
        console.log(ptemp);
        props.push({
            name: prop.name,
            definition: ptemp.innerText,
            html: ptemp.innerHTML
        })
    }


    console.log(props);
}();