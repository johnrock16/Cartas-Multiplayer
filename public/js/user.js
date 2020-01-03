export default  class User{
    constructor(restConnection){
        this.restConnection=restConnection;
        this.registerOrLogin=this.registerOrLogin.bind(this);
        this.verificaToken=this.verificaToken.bind(this);
        this.getPlayerUser=this.getPlayerUser.bind(this);
        this.setPlayerUser=this.setPlayerUser.bind(this);
    }
    playerUser;
    restConnection;
    socket;
    
    registerOrLogin(user,path){
        return this.restConnection.restServices('/auth/'+path,'POST',JSON.stringify(user)).then(function(data){
            return {'status':true,'user':user,'data':data};
        }).catch(function(error){
            return {'status':false,'data':error};
        });
    }

    verificaToken(){
        var data={'_id':this.playerUser.userId,'lastToken':this.playerUser.token};
        var headers= {'headers':{'authorization':'Bearer '+this.playerUser.token}};
        this.restConnection.restServices('/users','POST',data,headers).then(function(data){
            if(!data.ok){
                location.reload(); 
                this.socket.emit('sessionExpired',playerUser.userName);
                this.socket.disconnect();
            }
        }).catch(function(error){
            console.log("erro ao verificar o token");
        });
    }
    
    setPlayerUser(player){
        this.playerUser=player;
    }

    getPlayerUser(){
        return this.playerUser;
    }

    setSocket(socket){
        this.socket=socket;
    }
    
    getSocket(){
        return this.socket;
    }
}