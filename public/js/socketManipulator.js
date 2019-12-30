class SocketManipule{

    constructor(baseUrl,playerUser){
        this.socket=io(baseUrl);
        this.domManipule=new DomManipule();
        this.playerUser=playerUser;
        this.disconnect=false;
        this.socket.emit('newPlayerAuthenticate',playerUser);
        
        this.init=this.init.bind(this);
        this.roundsEnd=this.roundsEnd.bind(this);
        this.getDisconnect=this.getDisconnect.bind(this);
        this.setDisconnect=this.setDisconnect.bind(this);
        this.throwCard=this.throwCard.bind(this);
        
        this.init();
    }
    
    socket;
    domManipule;
    disconnect;
    playerUser;
    players=[];
    playerObj={};   
    playerRound=0;
    actualRound=0;    

    init()
    {
        $('#chat').submit((event)=>{
            event.preventDefault();
            var message=$('#txtMessage').val();

            if(message.length){
                var obj={
                    'author':this.playerUser.userName,
                    'message':message
                };
                this.socket.emit('sendMessage',obj);
                this.domManipule.renderMessage(obj);
            }
        });

        this.socket.on('previousMessages',(messages)=>{
            if(this.disconnect) return;
            messages.forEach(message => {
                this.domManipule.renderMessage(message);
            });
        })
    
        this.socket.on('receivedMessage',(message)=>{
            if(this.disconnect) return;
            this.domManipule.renderMessage(message);
        });
    
        this.socket.on('initialRound',(player)=>{
            this.actualRound=player.actualRound;
            this.playerRound=player.playerRound;
            this.playerObj=player.playerObj;
            this.domManipule.renderCards(this.playerObj.cards);
        });
    
        this.socket.on('nextRound', (round)=>{
            this.actualRound=round;
            console.log("trocou de round "+round);
        });
    
        this.socket.on('newPlayer', (newPlayer)=>{
            if(this.disconnect) return;
            if(this.playerObj.userId!=newPlayer.userId){
                this.players.push(newPlayer);
                this.domManipule.playerEntered(newPlayer.userName);
                console.log("novo player entrou "+newPlayer.userName);
                console.log(this.players);
            }
        });
    
        this.socket.on('previousPlayers',(previousPlayers)=>{
            previousPlayers.forEach(newPlayer => {
                this.players.push(newPlayer);
                this.domManipule.playerEntered(newPlayer.userName);
            });
        });
    
        this.socket.on('updateLastCard',(card)=>{
            console.log("updateLastCard");
            this.domManipule.renderLastCard(card);
        });
    
        this.socket.on('removePlayer',(userName)=>{
            $('#'+userName+'').remove();
            console.log('sessao expirou');
        });
    }

    setDisconnect(disconnect){
        this.disconnect=disconnect;
    }

    getDisconnect(){
        return this.disconnect;
    }
    

    roundsEnd(){
        if(this.playerRound==this.actualRound){
            this.socket.emit('roundsEnd',this.playerRound);
        }
    }

    throwCard(index){
        if(this.playerRound==this.actualRound){
            this.socket.emit('throwCard',this.playerObj.cards[index]);
            this.domManipule.renderLastCard(this.playerObj.cards[index].name);
            this.playerObj.cards.splice(index,1);
            this.domManipule.renderCards(this.playerObj.cards);
        }  
    }

    
}
