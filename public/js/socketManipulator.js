import DomManipule from './domManipulator.js';
export default class SocketManipule{

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
            this.domManipule.renderCards(this.playerObj.cards,this.throwCard);
        });
    
        this.socket.on('nextRound', (round)=>{
            this.actualRound=round;
        });
    
        this.socket.on('newPlayer', (newPlayer)=>{
            if(this.disconnect) return;
            if(this.playerObj.userId!=newPlayer.userId){
                this.players.push(newPlayer);
                this.domManipule.playerEntered(newPlayer.userName);
                console.log("novo player entrou "+newPlayer.userName);
            }
        });
    
        this.socket.on('previousPlayers',(previousPlayers)=>{
            previousPlayers.forEach(newPlayer => {
                this.players.push(newPlayer);
                this.domManipule.playerEntered(newPlayer.userName);
            });
        });
    
        this.socket.on('updateLastCard',(card)=>{
            this.domManipule.renderLastCard(card);
        });
    
        this.socket.on('removePlayer',(userName)=>{
            $('#'+userName+'').remove();
        });
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
            this.domManipule.renderCards(this.playerObj.cards,this.throwCard);
        }  
    }

    setDisconnect(disconnect){
        this.disconnect=disconnect;
    }

    getDisconnect(){
        return this.disconnect;
    }
}