const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PLAYER_STORAGE_KEY = "F8_PLAYER";
const heading = $("header h2");
const cdThumb = $(".cd-thumb");
const audio = $("#audio");
const playBtn = $(".btn-toggle-play");
const player = $(".player");
const progress = $("#progress");
const nextBtn = $(".btn-next");
const prevBtn = $(".btn-prev");
const randomBtn = $(".btn-random");
const repeatBtn = $(".btn-repeat");
const playList = $(".playlist");

const app = {
  currentIndex: 0,
  isPlaying: false,
  isRandom: false,
  isRepeat: false,
  config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},

  songs: [
    {
      name: "Only",
      singer: "Lee Hi",
      path: "./assests/music/Only-LeeHi-7076476.mp3",
      image: "./assests/img/Only.jpg",
    },
    {
      name: "Floating",
      singer: "Alina Baraz",
      path: "./assests/music/Floating - Alina Baraz_ Khalid_ Filous.mp3",
      image: "./assests/img/Floating.jpeg",
    },
    {
      name: "PS5",
      singer: "Salem ilese",
      path: "./assests/music/PS5 - Salem ilese_ TXT_ Alan Walker.mp3",
      image: "./assests/img/PS5.jpeg",
    },
    {
      name: "ABC Song",
      singer: "GAYLE",
      path: "./assests/music/abcdefu - GAYLE_ Royal The Serpent.mp3",
      image: "./assests/img/ABC.jpeg",
    },
    {
      name: "Bones",
      singer: "Imagine Dragons",
      path: "./assests/music/Bones - Imagine Dragons.mp3",
      image: "./assests/img/bone.jpeg",
    },
    {
      name: "Past Lives",
      singer: "BORNS",
      path: "./assests/music/Past Lives - BORNS.mp3",
      image: "./assests/img/pastLives.jpeg",
    },
    {
      name: "Star Boy",
      singer: "The WeekEnd",
      path: "./assests/music/Starboy - The Weeknd_ Daft Punk.mp3",
      image: "./assests/img/Star_boy.jpeg",
    },
    {
      name: "Save Your Tear",
      singer: "The WeekEnd",
      path: "./assests/music/SaveYourTear.mp3",
      image: "./assests/img/SaveYourTear.jpeg",
    },
    {
      name: "Ignite",
      singer: "K-319 Ft Alan Walker",
      path: "./assests/music/Ignite - K-391_ Alan Walker_ Julie Berga.mp3",
      image: "./assests/img/Ignite.jpeg",
    },
  ],
  setConfig: function (key, value) {
    this.config[key] = value;
    localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config));
  },
  start: function () {
    //Load cấu hình từ config vào ứng dụng
    this.loadConfig();
    //render playlist
    this.render();

    //lắng nghe / xử lý sự kiện DOM
    this.handleEvent();

    //Định nghĩa  các thuộc tính
    this.defineProperties();

    //tải thông tin bài hát đầu tiên vào UI khi chạy ứng dụng
    this.loadCurrentSong();
    //Hiển thị trạng thái ban đầu của button repeat và random
    repeatBtn.classList.toggle("active", this.isRepeat);
    randomBtn.classList.toggle("active", this.isRandom);
    // Lưu config
  },
  loadConfig: function () {
    this.isRandom = this.config.isRandom;
    this.isRepeat = this.config.isRepeat;
    this.currentIndex = this.config.currentIndex;
  },
  loadCurrentSong: function () {
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
    const html = this.songs.map((song, index) => {
      return `
      <div class="song ${
        index === this.currentIndex ? "active" : ""
      }" data-index="${index}">
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
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
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
    };
    //Khi song play
    audio.onplay = function () {
      _this.isPlaying = true;
      player.classList.add("playing");
      cdThumbAnimate.play();
    };
    //khi song pause
    audio.onpause = function () {
      _this.isPlaying = false;
      player.classList.remove("playing");
      cdThumbAnimate.pause();
    };
    //Khi tiến độ bài hát thay đổi
    audio.ontimeupdate = function () {
      if (audio.duration) {
        const currentPercentage = Math.floor(
          (audio.currentTime / audio.duration) * 100
        );
        progress.value = currentPercentage;
      }
    };
    //xử lý khi tua bài hát
    progress.oninput = function (e) {
      const seekTime = (e.target.value * audio.duration) / 100;
      audio.currentTime = seekTime;
    };

    //Xử lý CD quay và dừng
    const cdThumbAnimate = cdThumb.animate([{ transform: "rotate(360deg)" }], {
      duration: 10000,
      iterations: Infinity,
    });
    //Xử lý khi next
    nextBtn.onclick = function () {
      if (_this.isRandom) {
        _this.playRandomSong();
      } else {
        _this.nextSong();
      }
      audio.play();
      _this.render();
      _this.scrollToActiveSong();
    };
    //xử lý khi prev
    prevBtn.onclick = function () {
      if (_this.isRandom) {
        _this.playRandomSong();
      } else {
        _this.preSong();
      }
      audio.play();
      _this.render();
      _this.scrollToActiveSong();
    };
    //Xử lý random bật tắt
    randomBtn.onclick = function (e) {
      _this.isRandom = !_this.isRandom;
      _this.setConfig("isRandom", _this.isRandom);
      randomBtn.classList.toggle("active", _this.isRandom);
    };
    //xử lý next khi audio end
    audio.onended = function () {
      if (_this.isRepeat) {
        audio.play();
      } else {
        nextBtn.click();
      }
      _this.render();
      _this.scrollToActiveSong();
    };
    //xử lý phát lại 1 bài hát
    repeatBtn.onclick = function (e) {
      _this.isRepeat = !_this.isRepeat;
      _this.setConfig("isRepeat", _this.isRepeat);

      repeatBtn.classList.toggle("active", _this.isRepeat);
    };
    //xử lý khi click vào bài hát
    playList.onclick = function (e) {
      const songNode = e.target.closest(".song:not(.active)");
      const optionNode = e.target.closest(".song .option");
      //xử lý khi click vào song
      if (songNode) {
        _this.currentIndex = Number(songNode.dataset.index);
        _this.loadCurrentSong();
        _this.render();
        audio.play();
      }
      //xử lý khi click vào option
      if (optionNode) {
        console.log(123);
      }
      _this.setConfig("currentIndex", _this.currentIndex);
    };
    cdThumbAnimate.pause();
  },
  nextSong: function () {
    this.currentIndex++;
    if (this.currentIndex > this.songs.length - 1) {
      this.currentIndex = 0;
    }
    this.loadCurrentSong();
    this.setConfig("currentSong", this.currentSong);
    this.setConfig("currentIndex", this.currentIndex);
  },
  preSong: function () {
    this.currentIndex--;
    if (this.currentIndex < 0) {
      this.currentIndex = this.songs.length - 1;
    }
    this.loadCurrentSong();
    this.setConfig("currentSong", this.currentSong);
    this.setConfig("currentIndex", this.currentIndex);
  },
  playRandomSong: function () {
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * this.songs.length);
    } while (newIndex === this.currentIndex);
    this.currentIndex = newIndex;
    this.loadCurrentSong();
    this.setConfig("currentSong", this.currentSong);
    this.setConfig("currentIndex", this.currentIndex);
  },
  scrollToActiveSong: function () {
    setTimeout(() => {
      $(".song.active").scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }, 300);
  },
};
app.start();
