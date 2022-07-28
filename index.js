const ProfilePlus = document.querySelector('.profile-plus');
const ProfileList = document.querySelector('.profile-list');
const Save = document.querySelector('.saved');
const ProfileControl = document.querySelector('.profile-control');
const ProfileEdit = document.querySelector('.profile-edit');

const plusProfile = () => {
    var li = document.createElement("li");
    var children = ProfileList.children.length + 1;
    li.classList.add('profile')
    li.innerHTML = `${children}`
    ProfileList.appendChild(li)
}

ProfilePlus.addEventListener('click', () => {
    plusProfile();
    ProfileControl.style.Width = Save.offsetWidth - ProfileEdit.offsetWidth;
    console.log(ProfileControl.offsetWidth)
})
