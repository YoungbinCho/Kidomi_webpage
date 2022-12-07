const video = document.getElementById('video')

Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri('/static/js/model'),
  faceapi.nets.ageGenderNet.loadFromUri('/static/js/model')
]).then(startVideo)

function startVideo() {
  navigator.getUserMedia(
    { video: {} },
    stream => video.srcObject = stream,
    err => console.error(err)
  )
}

video.addEventListener('play', () => {
  const canvas = faceapi.createCanvasFromMedia(video)
  document.querySelector(".video_box").append(canvas)
  const displaySize = { width: video.width, height: video.height }
  faceapi.matchDimensions(canvas, displaySize)
  let ageList=[]
  i=1;
  var timer = setInterval(async () => {
    const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withAgeAndGender()
    const resizedDetections = faceapi.resizeResults(detections, displaySize)
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
    faceapi.draw.drawDetections(canvas, resizedDetections)
    resizedDetections.forEach( detection => {
      const box = detection.detection.box
      const drawBox = new faceapi.draw.DrawBox(box, { label: Math.round(detection.age) + " year old " + detection.gender })
      drawBox.draw(canvas)
      ageList.push(Math.round(detection.age));
      console.log(Math.round(detection.age))
      i=i+1;
      if(i>=10){
        clearInterval(timer);
        timer=null;
        send(ageList);
      } 
    })
  }, 1000)
})

function send(ageList)
{
  // 최빈값 받아오기
   let mode = getMode(ageList);   
   if (mode<50){
    location.href='/menu'
   }
   else{
    location.href='/menu2' 
   }
}

function getMode(array){
  // 1. 출연 빈도 구하기
  const counts = array.reduce((pv, cv)=>{
      pv[cv] = (pv[cv] || 0) + 1;
      return pv;
  }, {});
  // 2. 최빈값 구하기
  const keys = Object.keys(counts);
  
  let mode = keys[0];
  keys.forEach((val, idx)=>{
      if(counts[val] > counts[mode]){
          mode = val;
      }
      else if(counts[val] == counts[mode]){
          if(val > mode){
              mode = val;
          }
      }
  });

  return mode;
}