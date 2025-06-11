const loginSignupLink =
    document.querySelectorAll(".register a");
const form = document.querySelector("body");
loginSignupLink.forEach(link => {
    link.addEventListener("click", (e) => {
        e.preventDefault();
        form.classList[link.id === "signup-link" ? "add" : "remove"]("show-signup");
    })
})


//Exit
const exit=document.querySelectorAll('.close_form');
exit.forEach(item=>{
    item.addEventListener('click',()=>{
        window.location.href = './index.html';
    })
})
const summit=document.querySelector('.btn_admin');
summit.addEventListener('click',()=>{
    var email=document.querySelector('#email').value;
    var password=document.querySelector('#password').value;
    if(flag==true&&email=='admin123@gmail.com'&&password=='Admin123')
        console.log(1)
        window.location.href = './admin.html';
})
var flag=true
//Validation
function Validator(options) {
    var selectorRules={};
    function validate(inputElement, rule) {
        var errorMessage;
        var errorElement = inputElement.parentElement.querySelector(options.errorSelector);
        var rules=selectorRules[rule.selector];
        for(var i=0;i<rules.length;++i){
            errorMessage= rules[i](inputElement.value);
            flag=false;
            if(errorMessage) break;
        }
        if (errorMessage) {
            errorElement.innerText = errorMessage;
            inputElement.parentElement.classList.add('invalid');
        }
        else {
            errorElement.innerText = '';
            inputElement.parentElement.classList.remove('invalid');
            flag=true;
        }
    }
    var formElement = document.querySelector(options.form);
    if (formElement) {
        formElement.onsubmit=function(e){
            e.preventDefault();
            options.rules.forEach(function (rule){
                var inputElement=formElement.querySelector(rule.selector);
                validate(inputElement,rule);
            });
        }   
            options.rules.forEach(function (rule) {
            //Lưu rules lại cho mỗi input
            if(Array.isArray(selectorRules[rule.selector]))
            {
                selectorRules[rule.selector].push(rule.test);
            }
            else
            {
                selectorRules[rule.selector]=[rule.test];
            }
            var inputElement = formElement.querySelector(rule.selector);
            if (inputElement) {
                inputElement.onblur = function () {
                    validate(inputElement, rule);
                }
                inputElement.oninput=function(){
                    var errorElement = inputElement.parentElement.querySelector('.form-message');
                    errorElement.innerText = '';
                    inputElement.parentElement.classList.remove('invalid');
                }
            }
        });
    }
}
Validator.isEmail = function (selector) {
    return {
        selector: selector,
        test: function (value) {
            var regex=/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            return regex.test(value)?undefined:'Trường này phải là email';
        }
    };
}
Validator.isRequired = function (selector) {
    return {
        selector: selector,
        test: function (value) {
            return value.trim()?undefined:'Vui lòng nhập trường này'
        }
    };
}
Validator.isPassword = function (selector) {
    return {
        selector: selector,
        test: function (value) {
            var regex=/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/;
            return regex.test(value)?undefined:'Mật khẩu không hợp lệ!';
        }
    };
}
Validator.isConfirmed=function(selector,getConfirmValue,message){
    return{
        selector: selector,
        test: function(value){
            return value === getConfirmValue() ? undefined : message||'Giá trị nhập vào không chính xác';
        }
    }
}


Validator({
    form: '#form-1',
    errorSelector:'.form-message',
    rules: [
        Validator.isRequired('#email'),
        Validator.isEmail('#email'),
        Validator.isRequired('#password'),
        Validator.isPassword('#password')

    ],
})
Validator({
    form: '#form-2',
    errorSelector:'.form-message',
    rules: [
        Validator.isRequired('#email-2'),
        Validator.isEmail('#email-2'),
        Validator.isRequired('#password-2'),
        Validator.isPassword('#password-2'),
        Validator.isRequired('#password_confirmation'),
        Validator.isConfirmed('#password_confirmation',function(){
            return document.querySelector('#form-2 #password-2').value;  
        },'Mật khẩu nhập lại không chính xác')
    ],
})
