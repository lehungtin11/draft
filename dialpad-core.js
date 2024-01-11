console.log("update core");
class pbx_3CX{

    #ws=null;
    Start() {
        this.#ConnectWebSocket();
        setInterval(() => {
            if (this.#ws.readyState === WebSocket.CLOSED) {
                this.#ConnectWebSocket();
            }
        }, 2000);
    }
    
    #ConnectWebSocket () {
        let wsImpl = window.WebSocket || window.MozWebSocket;
        this.#ws = new wsImpl('ws://localhost:8383/');
        this.#ws.onmessage = evt=>this.#NhanDuLieuWebSocket(evt.data);
        this.#ws.onopen =()=>this.#OnOpenConnect();
        this.#ws.onerror = ()=>this.#OnErrorConnect();
    }
    #OnOpenConnect(){
        this.#ws.send(`{"type":"SetQueueLoginStatus","loggedIn":false}`);
        this.Event_Connect_3CX("Connect successfull");
       
    }
    #OnErrorConnect(){
        this.#ws.close();
        this.Event_Error_3CX("Connnect error");
    }
    #SendWebSocketMessage (text,callback) {
        if (this.#ws && this.#ws.readyState === WebSocket.OPEN) {
            if (!this.#CheckExtension()){
			console.log("SendWebSocketMessage return");
			return;
		} 
    	    console.log("SendWebSocketMessage text: " + text);
            this.#ws.send(text);
            if (callback) {
                callback();
            }
        } else {
            this.Event_SendMessageError_3CX("Khong Lay Duoc Thong Tin softphone... Dang Ket Noi Lai...");
        }
    }
    
    #CheckExtension () {
        if (!this.#currentExtension) {
            this.Event_SendMessageError_3CX("He Thong Khong Lay Duoc THong TIn Extension");
	    console.log("He Thong Khong Lay Duoc THong TIn Extension");
            return false;
        } else {
            return true;
        }
    }
  
    #SomeFunctionEndCall()
    {
      this.#check_click_make_call = false;
  
                  if(this.#check_ringing == true)
                  {
            this.#open_new_tab =  false;
                    this.#check_ringing = false;
                this.#check_connect = false;
                    this.Event_Ended_3CX(this.#currentCall,this.#currentExtension);
                              }
                   
                    this.#currentCall = undefined;
                    this.#check_click_end_call = false;
                    this.#check_click_make_call = false;
                    console.log("end-call-event");
    }
  
  
    #currentExtension = undefined;
    #NhanDuLieuWebSocket(data) {
        let obj = JSON.parse(data);
  
        if (!obj) return;
        switch (obj.Event) {
            case "OnOpen":
                if (obj.extensionInfo) {
                    this.#currentExtension = obj.extensionInfo;
            this.#extension_number = obj.extensionInfo.Number;
          console.log("extension_number Core CRM: " + this.#extension_number)
                    this.#ws.send(`{"type":"SendCallInfo"}`);
            this.#open_new_tab = true;
                    this.Event_Connect_3CX_Listen_Extension(this.#currentExtension);
                }
                break;
            case "OnCallStatusChanged":
                if (obj.callInfo) this.#NhanSuKienOnCallStatusChanged(obj);
                break;
            case "OnMyPhoneStatusChanged":
              {
                  console.log("OnMyPhoneStatusChanged");
                  if (obj.extensionInfo) {
                      this.#currentExtension = obj.extensionInfo;
                      // if(this.#check_ringing)
                      // {
                      //   this.#SomeFunctionEndCall();
                      // }
                      // else
                      // {
                        
                      //   console.log("OnMyPhoneStatusChanged --> first time recieved OnMyPhoneStatusChanged")
                      // }
                  }
                  break;
              }
               
            case "CurrentProfileChanged":
                if (obj.NewProfileId !== undefined) this.Event_ChangeProfile_3CX(obj.NewProfileId,this.#currentExtension);
                break;
              case "SendRetryConnectSoftphone":
                  {
                      console.log("SendRetryConnectSoftphone");
                      if(this.#check_ringing)
                      {
                          console.log("SendRetryConnectSoftphone ==> check_ringing is true ==> send event End Call");
                          this.#SomeFunctionEndCall();
                      }
                      else
                      {
                          console.log("SendRetryConnectSoftphone ==> check_ringing is false ==> Not action");
                      }
                      
                      break;
                  }
        }
    }
  #open_new_tab = false;
  #check_re_connect = false;
    #currentCall = undefined;
    #check_ringing = false;
  #extension_number = "";
    #check_connect = false;
    #check_click_end_call = false;
    #check_click_make_call = false;
    #NhanSuKienOnCallStatusChanged(obj) {
        this.#currentCall = obj.callInfo;
        this.Event_ChangeIsHold_3CX(this.#currentCall.IsHold,this.#currentExtension);
        this.Event_ChangeIsMute_3CX(this.#currentCall.IsMuted,this.#currentExtension);
        switch (this.#currentCall.State) {
            case 1:
                {
                  if (this.#check_ringing) 
                  {
  
                  }
                  else
                  {
                      this.#check_ringing = true;
                      this.#open_new_tab = false;
                      this.Event_Ringing_3CX(this.#currentCall,this.#currentExtension);
              
                  }
  
                  
                  break;
                }
            case 2:
                {
                  if (this.#check_ringing) 
                  {
  
                  }
                  else
                  {
                      this.#check_ringing = true;
                      this.#open_new_tab = false;
                      this.Event_Dialing_3CX(this.#currentCall,this.#currentExtension);
          
  
                  }
  
                
                  break;
                }
            case 3:
                {
                  if(this.#check_connect)
            {
    
            }
            else
            {
              if(this.#check_ringing)
              {
                  this.#check_connect = true;
    
                  this.Event_Connected_3CX(this.#currentCall,this.#currentExtension);
              }
                
               
            }
          
                  break;
                }
            case 4:
                {
                    if (this.#check_ringing) 
                    {
    			
                    }
                    else
                    {
                        this.#check_ringing = true;
                        this.#open_new_tab = false;
                        this.Event_Dialing_3CX(this.#currentCall,this.#currentExtension);
			this.#ws.send(`{"type":"state 4","Content":"Goi tu deskphone"}`);


                    }
		
                    console.log("state 4: goi tu deskphone");
                  break;
                }
            case 5:
                {
                  if (this.#currentCall) 
                  {
                    this.#ws.send(`{"type":"DropCall","callId":"${this.#currentCall.CallID}"}`);
                  }
                  break;
                }
            case 6:
                {
                  this.#SomeFunctionEndCall();
                    console.log("end-call-event");
                    break;
                }
            default:
                break;
        }
    }
    Event_SendMessageError_3CX=(conten)=>{};
    Event_Connect_3CX_Listen_Extension=(ext)=>{};
    Event_Connect_3CX=(conten)=>{};
    Event_Error_3CX=(error)=>{};
    Event_Ringing_3CX=(num,ext)=>{};
    Event_Dialing_3CX=(num,ext)=>{};
    Event_Connected_3CX=(num,ext)=>{};
    Event_Ended_3CX=(num,ext)=>{};
    Event_ChangeProfile_3CX=(profileId,ext)=>{};
    Event_ChangeIsHold_3CX=(isHold,ext)=>{};
    Event_ChangeIsMute_3CX=(isMute,ext)=>{};
    Send_MakeCall_3CX(phoneNum) {
        if(this.#currentCall){
            console.log("exist call");
        }
        else
        {
          if(this.#check_click_make_call == false)
          {
              this.#check_click_make_call = true;
              this.#SendWebSocketMessage(`{"type":"MakeCall","destination":"${phoneNum}"}`);
          }
          else
          {
              console.log("clicked - make call");
          }
          
        }
    }
  
    Send_DropCall_3CX() {
        if(this.#currentCall){
              if(this.#check_click_end_call == false)
              {
                  this.#check_click_end_call = true;
                  this.#SendWebSocketMessage(`{"type":"DropCall","callId":"${this.#currentCall.CallID}"}`);
              }
              else
              {
                  console.log("clicked not action");
              }
            
        }
        else
        {
            console.log("empty call");
        }
      
    }
  
    Send_ActiveCall_3CX() {
        if(this.#currentCall){
            this.#SendWebSocketMessage(`{"type":"ActivateEx","callId":"${this.#currentCall.CallID}","options":0}`);
        }
    }
  
    Send_Hold_3CX(IsHold) {
        if(this.#currentCall){
            this.#SendWebSocketMessage(`{"type":"Hold","callId":"${this.#currentCall.CallID}","holdOn":${IsHold}}`);
        }
    }
  
    Send_Mute_3CX(IsMute) {
        if(this.#currentCall){
            this.#SendWebSocketMessage(`{"type":"Mute","callId":"${this.#currentCall.CallID}"}`);
        }
    }
    Send_Transfer_3CX(phoneNum) {
        if(this.#currentCall){
            this.#SendWebSocketMessage(`{"type":"BlindTransfer","callId":"${this.#currentCall.CallID}","destination":"${phoneNum}"}`);
        }
    }
    Send_SetQueueLoginStatus(login) {
        //if(this.#currentCall){
            this.#SendWebSocketMessage(`{"type":"SetQueueLoginStatus","loggedIn":${login}}`);
        //}
    }
     Send_SetActiveProfile(profileid) {
        //if(this.#currentCall){
            this.#SendWebSocketMessage(`{"type":"SetActiveProfile","ProfileId":"${profileid}"}`);
        //}
    }
  }