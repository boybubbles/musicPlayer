const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const heading = $("header h2");
const cdThumb = $(".cd-thumb");
const audio = $("#audio");
const playBtn = $(".btn-toggle-play");
const player = $(".player");
const progress = $("#progress");

const app = {
  currentIndex: 0,
  isPlaying: false,
  songs: [
    {
      name: "Only",
      singer: "Lee Hi",
      path: "./assests/music/Only-LeeHi-7076476.mp3",
      image: "./assests/img/Only.jpg",
    },
    {
      name: "",
      singer: "Alina Baraz",
      path: "./assests/music/Floating - Alina Baraz_ Khalid_ Filous.mp3",
      image: "./assests/img/Floating.jpeg",
    },
    {
      name: "",
      singer: "Alina Baraz",
      path: "./assests/music/Floating - Alina Baraz_ Khalid_ Filous.mp3",
      image: "./assests/img/Floating.jpeg",
    },
    {
      name: "",
      singer: "Alina Baraz",
      path: "./assests/music/Floating - Alina Baraz_ Khalid_ Filous.mp3",
      image: "./assests/img/Floating.jpeg",
    },
    {
      name: "",
      singer: "Alina Baraz",
      path: "./assests/music/Floating - Alina Baraz_ Khalid_ Filous.mp3",
      image: "./assests/img/Floating.jpeg",
    },
    {
      name: "",
      singer: "Alina Baraz",
      path: "./assests/music/Floating - Alina Baraz_ Khalid_ Filous.mp3",
      image: "./assests/img/Floating.jpeg",
    },
    {
      name: "",
      singer: "Alina Baraz",
      path: "./assests/music/Floating - Alina Baraz_ Khalid_ Filous.mp3",
      image: "./assests/img/Floating.jpeg",
    },
    {
      name: "",
      singer: "Alina Baraz",
      path: "./assests/music/Floating - Alina Baraz_ Khalid_ Filous.mp3",
      image: "./assests/img/Floating.jpeg",
    },
    {
      name: "",
      singer: "Alina Baraz",
      path: "./assests/music/Floating - Alina Baraz_ Khalid_ Filous.mp3",
      image: "./assests/img/Floating.jpeg",
    },
    {
      name: "",
      singer: "Alina Baraz",
      path: "./assests/music/Floating - Alina Baraz_ Khalid_ Filous.mp3",
      image: "./assests/img/Floating.jpeg",
    },
    {
      name: "",
      singer: "Alina Baraz",
      path: "./assests/music/Floating - Alina Baraz_ Khalid_ Filous.mp3",
      image: "./assests/img/Floating.jpeg",
    },
    {
      name: "",
      singer: "Alina Baraz",
      path: "./assests/music/Floating - Alina Baraz_ Khalid_ Filous.mp3",
      image: "./assests/img/Floating.jpeg",
    },
    {
      name: "",
      singer: "Alina Baraz",
      path: "./assests/music/Floating - Alina Baraz_ Khalid_ Filous.mp3",
      image: "./assests/img/Floating.jpeg",
    },
    {
      name: "",
      singer: "Alina Baraz",
      path: "./assests/music/Floating - Alina Baraz_ Khalid_ Filous.mp3",
      image: "./assests/img/Floating.jpeg",
    },
    {
      name: "",
      singer: "Alina Baraz",
      path: "./assests/music/Floating - Alina Baraz_ Khalid_ Filous.mp3",
      image: "./assests/img/Floating.jpeg",
    },
    {
      name: "",
      singer: "Alina Baraz",
      path: "./assests/music/Floating - Alina Baraz_ Khalid_ Filous.mp3",
      image: "./assests/img/Floating.jpeg",
    },
    {
      name: "",
      singer: "Alina Baraz",
      path: "./assests/music/Floating - Alina Baraz_ Khalid_ Filous.mp3",
      image: "./assests/img/Floating.jpeg",
    },
  ],
  start: function () {
    //render playlist
    this.render();

    //lắng nghe / xử lý sự kiện DOM
    this.handleEvent();

    //Định nghĩa  các thuộc tính
    this.defineProperties();

    //tải thông tin bài hát đầu tiên vào UI khi chạy ứng dụng
    this.loadCurrrentSong();
  },
  loadCurrrentSong: function () {
    heading.textContent = this.currentSong.name;
    cdThumb.style.backgroundImage = `url("${this.currentSong.image}")`;
    audio.src = this.currentSong.path;
  },
  defineProperties: function () {
    Object.defineProperty(this, "currentSong", {
      get: function () {
        return this.songs[this.currentIndex];
      },
    });
  },
  render: function () {
    const html = this.songs.map((song) => {
      return `
      <div class="song">
        <div
            class="thumb"
            style="background-image: url('${song.image}')"
        ></div>
        <div class="body">
            <h3 class="title">${song.name}</h3>
            <p class="author">${song.singer}</p>
        </div>
        <div class="option">
            <i class="fas fa-ellipsis-h"></i>
        </div>
    </div>
        `;
    });
    $(".playlist").innerHTML = html.join("");
  },
  handleEvent: function () {
    const _this = this;
    const cd = $(".cd");
    const cdWidth = cd.offsetWidth;
    //xử lý phóng to thu nhỏ

    document.onscroll = function () {
      const scrollTop = window.screenY || document.documentElement.scrollTop;
      const newCDwidth = cdWidth - scrollTop;
      cd.style.width = newCDwidth > 0 ? newCDwidth + "px" : 0;
      cd.style.opacity = newCDwidth / cdWidth;
    };
    //xử lý khi click Play
    playBtn.onclick = function () {
      if (_this.isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
      //Khi song play
      audio.onplay = function () {
        _this.isPlaying = true;
        player.classList.add("playing");
      };
      //khi song pause
      audio.onpause = function () {
        _this.isPlaying = false;
        player.classList.remove("playing");
      };
      //Khi tiến độ bài hát thay đổi
      audio.ontimeupdate = function () {
        const currentPercent = Math.floor(
          (audio.currentTime / audio.duration) * 100
        );
        progress.value = currentPercent;
      };
      //xử lý khi tua bài hát
      progress.onchange = function (e) {
        const seekTime = (e.target.value * audio.duration) / 100;
        audio.currentTime = seekTime;
      };
    };
  },
};
app.start();
