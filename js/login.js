$(document).ready(function () {


    //login 
    $('#loginForm').on('submit', (e) => {
        e.preventDefault();

        let allHaveVal = true;

        //traverse all the input available
        $('.logInput').each(function () {

            let val = $(this).val()
            let field;
            field = ($(this).attr('name') === "password") ? $('.pass_details') : $(this); //look for password field

            //check if there's a value on a specific input
            if (val === "") {
                field.addClass('border-accent').removeClass('border-gray-400'); //add red border
                allHaveVal = false;

            } else field.removeClass('border-accent').addClass('border-gray-400');
        })

        //check if the the input have all value
        if (allHaveVal) {
            let formData = $('#loginForm')[0]; //get the form 
            let data = new FormData(formData); //the form we will send to the php file

            //action will be using
            let action = {
                action: 'read',
                query: true,
            }
            data.append('action', JSON.stringify(action))
            //perform ajax operation
            $.ajax({
                type: "POST",
                url: "../PHP_process/userData.php",
                data: data,
                processData: false,
                contentType: false,
                success: (response) => {
                    if (response == 'successful') {
                        $('#errorMsg').hide();
                        window.location.href = "../admin/admin.php";
                    }
                    else $('#errorMsg').show();
                },
                error: (error) => console.log(error)
            });
        }
    })

    //go registration button
    $('#registerBtn').on('click', function () {
        $('#registrationPanel').show();
        $('#loginPanel').hide();
        $('#graduateLogo').removeClass('relative').addClass('absolute bottom-0')
    })
    //go back to user login
    $('#registerBtnBack').on('click', function () {
        $('#registrationPanel').hide();
        $('#loginPanel').show();
        $('#graduateLogo').addClass('relative').removeClass('absolute bottom-0')
    })

    //go back to personal info
    $('#backToPersonInfo').on('click', function () {
        $('#userAccountPanel').hide();
        $('#personalInfoPanel').show();
        $('#graduateLogo').removeClass('relative').addClass('absolute bottom-0')
    })

    //go next panel
    $('#registerBtnNext').on('click', function () {
        $('#loginPanel').hide();
        if (checkFields('.personalInput')) {
            $('#personalInfoPanel').hide();
            $('#userAccountPanel').show();
            $('#graduateLogo').addClass('relative').removeClass('absolute bottom-0')
        }
    })

    $('#registerForm').on('submit', (e) => {
        //prevent from submitting
        e.preventDefault();

        //check if all field are complete before sending
        let inputFields = '#registerForm input';

        if (checkFields(inputFields)) {

            //check if both password and confirm pass is the same
            let password = $('#password').val();
            let confirmPass = $('#confirmpassword').val();

            if (password === confirmPass) {
                console.log(' magkamukha password')
            } else console.log('hindi magkamukha');
        }

    })

    $('#usernameField').on('change', function () {
        let username = $(this).val();

        let form = new FormData();
        var data = {
            action: 'read',
            query: false,
        };
        form.append('username', username);
        form.append('action', JSON.stringify(data))
        $.ajax({
            url: '../PHP_process/userData.php',
            type: 'POST',
            data: form,
            processData: false,
            contentType: false,
            success: (response) => {
                if (response == 'exist') {
                    $('#usernameField').addClass('border-accent').removeClass('border-gray-400');
                    $('#usernameWarning').show();
                }
                console.log(response)
            },
            error: (error) => {
                console.log(error)
            }
        })
    });

    //checking field
    function checkFields(element) {
        let allComplete = true;

        //check if all fields are complete
        $(element).each(function () {
            let inputVal = $(this).val();

            //check if the particular field is empty or not
            if (inputVal == "") {
                $(this).addClass('border border-accent').removeClass('border-gray-400')
                allComplete = false
            }
            else $(this).removeClass('border border-accent').addClass('border border-gray-400')
        });

        return allComplete;
    }
});