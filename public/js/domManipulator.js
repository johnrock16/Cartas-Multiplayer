class DomManipule{

    constructor(){
        this.renderCards=this.renderCards.bind(this);
        this.renderLastCard=this.renderLastCard.bind(this);
        this.renderMessage=this.renderMessage.bind(this);
        this.seePlayerCards=this.seePlayerCards.bind(this);
        this.playerEntered=this.playerEntered.bind(this);
        this.getUserInfos=this.getUserInfos.bind(this);
        this.openOrCloseModal=this.openOrCloseModal.bind(this);
    }

    renderCards(cards){
        $('.yourCards').empty();
        for(var i=0;i<cards.length;i++){
            $('.yourCards').append('<img class="action-card" src="./img/'+cards[i].name+'.jpg" onclick="throwCard('+i+')"></img>');
        }
    }

    renderMessage(message){
        $('.messages').append('<div class="message"><strong>'+message.author+':</strong><span>'+message.message+'</span></div>');
    }

    renderLastCard(card){
        $('.last-card').empty();
        $('.last-card').append('<img class="last-card-throw" src="./img/'+card+'.jpg"></img>');
    }

    playerEntered(id){
        $('.list-players').append('<div class="player col-12" id='+id+' onclick="seePlayerCards('+id+')"> <p>'+id+'</p></div>');
    }

    seePlayerCards(id){
        console.log("você esta vendo na teoria as cartas do player "+id);
    }

    getUserInfos(){
        var user={
            password: $('#txtPasswordLogin').val(),
            userName: $('#txtUsernameLogin').val()
        }
        return user;
    }  
    
    openOrCloseModal() {
        $('.modal').toggleClass('open');
    }

}