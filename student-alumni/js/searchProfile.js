$(document).ready(function () {

    const imgFormat = "data:image/jpeg;base64,"
    //search suggestion
    $('#searchUser').on('input', function () {
        const profileName = $(this).val()
        if (profileName != "") { //if the search bar is not empty
            $('#searchProfile').removeClass('hidden')
            retrieveUserNames(profileName)
        }
        else $('#searchProfile').addClass('hidden') //hide again the search suggestion
    })

    function retrieveUserNames(profileName) {
        const action = { action: "searchPerson" }
        const formdata = new FormData();
        formdata.append('action', JSON.stringify(action));
        formdata.append('personName', profileName);

        $.ajax({
            url: '../PHP_process/person.php',
            method: 'POST',
            data: formdata,
            contentType: false,
            processData: false,
            dataType: 'json',
            success: response => {
                $('#searchProfile').empty()
                if (response.response = "Success") {
                    let length = response.personID.length

                    for (let i = 0; i < length; i++) {
                        const personID = response.personID[i];
                        const fullname = response.fullname[i];
                        const status = response.status[i];
                        const profilePic = response.profilePic[i];

                        displaySuggestedName(personID, fullname, profilePic, status);
                    }
                }
            },
            error: error => { console.log(error) }
        })
    }

    function displaySuggestedName(personID, fullname, profilePic, status) {
        // mark up for displaying suggestions

        const wrapper = $('<div>')
            .addClass('p-3 flex items-center gap-2 hover:bg-red-300 hover:text-white text-gray-500 cursor-pointer')
            .on('click', function () {
                //show profile of user
                $('.loadingProfile').parent().removeClass('hidden')
                retrieveUserDetails(personID, roundedColor);
            })

        const roundedColor = (status == "Alumni") ? 'border-accent' : 'border-blue-400'
        const imgSrc = (profilePic == "") ? "../assets/icons/person.png" : imgFormat + profilePic
        const imgElement = $('<img>')
            .addClass('rounded-full h-10 w-10 border ' + roundedColor)
            .attr('src', imgSrc);

        const name = $('<p>').addClass('font-bold').text(fullname)
        const statusElement = $('<p>').addClass('text-xs').text(status)


        const personDetailsWrapper = $('<div>')
            .addClass('flex flex-col text-sm')
            .append(name, statusElement)
        wrapper.append(imgElement, personDetailsWrapper)
        $('#searchProfile').append(wrapper)
    }
    document.addEventListener('click', function (event) {
        if (!$('#searchProfile').is(event.target) && !$('#searchProfile').has(event.target).length) {
            $('#searchProfile').addClass('hidden')
        }
    })

    function retrieveUserDetails(personID, colorBorder) {
        const action = { action: 'userProfile' };
        const formdata = new FormData();
        formdata.append('action', JSON.stringify(action))
        formdata.append('personID', personID)

        $.ajax({
            url: '../PHP_process/person.php',
            method: 'POST',
            data: formdata,
            processData: false,
            contentType: false,
            dataType: 'json',
            success: response => {
                $('#profileModal').removeClass('hidden')
                if (response.response == 'Success') {
                    $('#userPostModal').empty()
                    const data = response
                    const fullname = data.fullname;
                    const profilePic = data.profilePic;
                    const coverPhoto = data.coverPhoto;
                    const facebookUN = data.facebookUN;
                    const instagramUN = data.instagramUN;
                    const twitterUN = data.twitterUN;
                    const linkedInUN = data.linkedInUN;
                    const username = data.username;

                    displayUserProfileModal(fullname, profilePic, coverPhoto, facebookUN, instagramUN, twitterUN, linkedInUN, username, colorBorder);
                }
            },
            error: error => { console.log(error) }
        })
    }

    function displayUserProfileModal(fullname, profilePic, coverPhoto, facebookUN, instagramUN, twitterUN, linkedInUN, username, colorBorder) {
        const coverSrc = (coverPhoto == "") ? '../images/bganim.jpg' : imgFormat + coverPhoto
        const profileSrc = (profilePic == "") ? '../assets/icons/person.png' : imgFormat + profilePic
        $("#profileModalCover").attr('src', coverSrc)
        $("#profileModalProfile").attr('src', profileSrc).addClass(colorBorder)
        $("#profileModalFN").text(fullname)
        $("#profileModalUN").text(username)

        // social media
        $("#facebookUN").text(facebookUN)
        $("#instagramUN").text(instagramUN)
        $("#twitterUN").text(twitterUN)
        $("#linkedInUN").text(linkedInUN)

        let offset = 0;
        //searched user post
        getUserPost(username, offset)
    }

    function getUserPost(username, offset) {
        const action = { action: 'readOtherUserPost' };
        const formdata = new FormData();
        formdata.append('action', JSON.stringify(action));
        formdata.append('offset', offset)
        formdata.append('status', 'available')
        formdata.append('username', username)

        $.ajax({
            url: '../PHP_process/postDB.php',
            method: 'POST',
            data: formdata,
            contentType: false,
            processData: false,
            dataType: 'json',
            success: response => {
                if (response.response == "Success") {
                    $('.loadingProfile').parent().addClass('hidden')
                    const data = response
                    const length = data.images.length
                    let tempCount = 0;

                    //check if there's a post to be displayed
                    if (length !== 0) {
                        $('#noProfileMsgSearch').addClass('hidden')
                        //display all the post
                        for (let i = 0; i < length; i++) {
                            //check first if the post is have image
                            if (data.images[i].length !== 0 && data.images[i].length == 1) {
                                const imgSrc = imgFormat + data.images[i];

                                const image = $('<img>')
                                    .addClass('rounded-lg h-28 w-full')
                                    .attr('src', imgSrc)

                                $('#userPostModal').append(image)
                                offset++
                                tempCount++
                            }

                        }
                    }


                    // scroll retrieved new set of data again
                    $('#userPostContainer').on('scroll', function () {
                        const containerHeight = $(this).height();
                        const contentHeight = $(this)[0].scrollHeight;
                        const scrollOffset = $(this).scrollTop();
                        const threshold = 50; // Define the threshold in pixels
                        if (containerHeight + scrollOffset + threshold >= contentHeight && tempCount == 10) {
                            getUserPost(username, offset)
                        }
                    })

                }
            },
            error: error => { $('#noProfileMsgSearch').removeClass('hidden') }
        })
    }


    //close the modal
    $('#profileModal').on('click', function (e) {
        const modal = $('#profileModalUser')
        const target = event.target

        //clicked outside the edit modal
        if (!modal.is(target) && !modal.has(target).length) {
            $(this).addClass('hidden')
        }
    })
})