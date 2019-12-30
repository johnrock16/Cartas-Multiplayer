class RestManipule{

    constructor(base_url){
        this.base_url=base_url;

        this.restServices=this.restServices.bind(this);
        this.setBaseUrl=this.setBaseUrl.bind(this);
        this.getBaseUrl=this.getBaseUrl.bind(this);
    }

    base_url;

    restServices(local,type,data,extras){
        var req={'url':this.base_url+''+local, 'type':type,'data':data}
        if(extras==null) extras={'contentType': "application/json"};
        req=Object.assign(req,extras);
        return new Promise(function(resolve, reject) {
            $.ajax(Object.assign(req,{
                success: function(data) {
                    resolve(data);
                },
                error: function(err) {
                    reject(err);
                }
            }));
        });
    }

    setBaseUrl(base_url){
        this.base_url=base_url;
    }

    getBaseUrl(){
        return this.base_url;
    }

}