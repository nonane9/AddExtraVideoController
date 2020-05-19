// ==UserScript==
// @name         Youtube / Add Extra Video Controller
// @namespace    nonanet
// @version      0.3
// @description  Add Extra Video Controller
// @author       non_shi
// @match        https://www.youtube.com/watch*
// @grant        none
// @run-at       document-idle
// ==/UserScript==

(setTimeout(()=>{
	const create_elm_style=(str_id)=>{
		const elm=document.createElement("style");
		elm.id=str_id;
		elm.textContent="body{overflow-x:hidden;}"+
			".exctl_base_panel{position:fixed;right:-45px;top:50px;width:200px;padding:10px 40px 10px 20px;border:2px outset whiteSmoke;border-radius:10px;z-index:10000;display:flex;flex-direction:column;background-color:whitesmoke;}"+
			".exctl_base_panel:not(:hover){transform:translateX(200px);}"+
			".exctl_base_panel>*{margin:5px;}"+
			".exctl_time_panel{margin-left:15px;font-size:14px;}"+
			".exctl_jump_panel{display:flex;justify-content:space-around;}"+
			".exctl_jump_panel>button{width:36px;height:36px;margin:5px;border-radius:50%;padding:0;text-align:center;cursor:pointer;}";
		return elm;
	};
	const create_show_panel=(elm_exctl_base)=>{
		const elm_base=document.createElement("div");
		elm_base.className="exctl_show_panel";
		elm_base.appendChild((()=>{
			const elm_label=document.createElement("label");
			elm_label.appendChild((()=>{
				const elm_input=document.createElement("input");
				elm_input.type="checkbox";
				elm_input.checked=false;
				elm_input.addEventListener("click",(event)=>{
					elm_exctl_base.style.transform=(event.target.checked?"initial":"");
				});
				return elm_input;
			})());
			elm_label.appendChild(document.createTextNode("Always display"));
			return elm_label;
		})());
		return elm_base;
	};
	const create_videoid_panel=()=>{
		const elm_base=document.createElement("div");
		const params=new URLSearchParams(location.search);
		elm_base.textContent="Now playing : "+params.get("v");
		return elm_base;
	};
	const create_time_panel=(elm_video)=>{
		const to_hms_string=(time)=>{
			const h=Math.floor(time/3600);
			const m=Math.floor(time%3600/60);
			const str_s=(time%60).toFixed(1);
			if(h>0){
				return h+":"+m.toString().padStart(2,"0")+":"+str_s.padStart(4,"0");
			}
			if(m>0){
				return m+":"+str_s.padStart(4,"0");
			}
			return str_s;
		};
		const elm_base=document.createElement("div");
		elm_base.className="exctl_time_panel";
		elm_base.appendChild((()=>{
			const elm_cur=document.createElement("span");
			elm_cur.textContent=to_hms_string(elm_video.currentTime);
			elm_video.addEventListener("timeupdate",()=>{
				elm_cur.textContent=to_hms_string(elm_video.currentTime);
			});
			return elm_cur;
		})());
		elm_base.appendChild((()=>{
			const elm_len=document.createElement("span");
			elm_len.textContent=" / "+to_hms_string(elm_video.duration);
			elm_video.addEventListener("durationchange",()=>{
				elm_len.textContent=" / "+to_hms_string(elm_video.duration);
			});
			return elm_len;
		})());
		return elm_base;
	};
	const create_jump_panel=(elm_video)=>{
		const create_jump_button=(jump_sec)=>{
			const elm_btn=document.createElement("button");
			//elm_btn.className="exctl_jump_btn";
			elm_btn.textContent=(jump_sec+"s");
			elm_btn.addEventListener("click",()=>{
				elm_video.currentTime+=jump_sec;
			});
			return elm_btn;
		};
		const elm_base=document.createElement("div");
		elm_base.className="exctl_jump_panel";
		elm_base.appendChild(create_jump_button(-30));
		elm_base.appendChild(create_jump_button(-10));
		elm_base.appendChild(create_jump_button(10));
		elm_base.appendChild(create_jump_button(30));
		return elm_base;
	};
	const create_playbackrate_panel=(elm_video)=>{
		const build_display_text=(playback_rate)=>{
			const rate=Number(playback_rate);
			return "Rate : "+rate.toFixed(2)+"x - 1sec fixed to "+(1/rate).toFixed(2)+"sec(s)";
		};
		const elm_base=document.createElement("div");
		elm_base.className="exctl_playbackrate_panel";
		const elm_display=document.createElement("div");
		elm_display.textContent=build_display_text(elm_video.playbackRate);
		elm_base.appendChild(elm_display);
		elm_base.appendChild((()=>{
			const elm_input=document.createElement("input");
			elm_input.type="range";
			elm_input.max=2;
			elm_input.min=0.25;
			elm_input.step=0.25;
			elm_input.value=elm_video.playbackRate;
			elm_input.addEventListener("input",()=>{
				elm_video.playbackRate=Number(elm_input.value);
			});
			elm_video.addEventListener("ratechange",()=>{
				elm_input.value=elm_video.playbackRate;
				elm_display.textContent=build_display_text(elm_video.playbackRate);
			});
			return elm_input;
		})());
		return elm_base;
	};
	const create_elm_exctl=(elm_video)=>{
		const elm_base_panel=document.createElement("div");
		elm_base_panel.className="exctl_base_panel";
		elm_base_panel.appendChild(create_show_panel(elm_base_panel));
		elm_base_panel.appendChild(create_videoid_panel());
		elm_base_panel.appendChild(create_time_panel(elm_video));
		elm_base_panel.appendChild(create_jump_panel(elm_video));
		elm_base_panel.appendChild(create_playbackrate_panel(elm_video));
		return elm_base_panel;
	};
	setInterval(()=>{
		const str_style_id="exctl_style";
		if(!document.getElementById(str_style_id)){
			document.body.appendChild(create_elm_style(str_style_id));
		}
		const elm_videos=document.getElementsByTagName("video");
		if(elm_videos.length==0){
			return;
		}
		const elm_video=elm_videos[0];
		const panel_attached_flag_name="exctl_attached";
		if(!(panel_attached_flag_name in elm_video.dataset)){
			elm_video.dataset[panel_attached_flag_name]=true;
			document.body.appendChild(create_elm_exctl(elm_video));
		}
	},1000);
}),5000);
