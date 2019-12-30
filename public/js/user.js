class User{
    constructor(restConnection){
        this.restConnection=restConnection;
        this.registerOrLogin=this.registerOrLogin.bind();
        this.verificaToken=this.verificaToken.bind();
        this.getPlayerUser=this.getPlayerUser.bind(this);
        this.setPlayerUser=this.setPlayerUser.bind(this);
    }
    playerUser;
    restConnection;
    
    registerOrLogin(user,path){
        return restConnection.restServices('/auth/'+path,'POST',JSON.stringify(user)).then(function(data){
            return {'status':true,'user':user,'data':data};
        }).catch(function(error){
            return {'status':false,'data':error};
        });
    }

    verificaToken(){
        var data={'_id':playerUser.userId,'lastToken':playerUser.token};
        var headers= {'headers':{'authorization':'Bearer '+playerUser.token}};
        restConnection.restServices('/users','POST',data,headers).then(function(data){
            if(!data.ok){
                location.reload(); 
                socket.emit('sessionExpired',playerUser.userName);
                socket.disconnect();
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

}