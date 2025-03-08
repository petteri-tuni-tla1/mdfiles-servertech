
var listFiles // Contains the list of files for current category
var fileListMap = new Map() // Map for list of files for all categories (folders)
var curDir = "";

async function fetchFilesList(fileprm) {  
  const response = await fetch(fileprm);
  const fileslist = await response.text();
  return fileslist;
}

// Calling from mdfiles.html
function prepareMD () {
  const urlParams = new URLSearchParams(window.location.search);
    const fileParam = urlParams.get('tip');
    const curParam = urlParams.get('nr')
    const nextParam = parseInt(urlParams.get('nr')) + 1
    const prevParam = parseInt(urlParams.get('nr')) - 1
    const dirParam = urlParams.get('dir');
    curDir = dirParam;

    console.log("Cur nr: " + curParam + " Next: " + nextParam + " prevParam: " + prevParam)
    
    fetchFilesList(dirParam + '.txt').then(list => {
        // console.log("List of files files:" + list);
        
        listFiles = list.split("\n")
        fileListMap.set(dirParam, listFiles)                
        
        const [nextFile, nextNr] = getNextFile(nextParam, dirParam)
        const [prevFile, prevNr] = getPreviousFile(prevParam, dirParam)

        let fileFile = dirParam +  '/' + fileParam + ".md"
        if (fileParam != '' && fileParam != null) {
          fileFile = dirParam +  '/' + fileParam + ".md";
        } else {
          const fileParam = urlParams.get('rootfile');
          if (fileParam != '' && fileParam != null) {
            fileFile = fileParam + ".md";
          }
        }
        // console.log("Fetch MD file file: " + fileFile);
                
        document.getElementById('ikoni').innerHTML =         
           '<a href=\"mdfiles.html?tip=' + nextFile + '&dir=' + dirParam + '&nr=' + nextNr + '\">' + 
'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-balloon" viewBox="0 0 16 16"> <path fill-rule="evenodd" d="M8 9.984C10.403 9.506 12 7.48 12 5a4 4 0 0 0-8 0c0 2.48 1.597 4.506 4 4.984M13 5c0 2.837-1.789 5.227-4.52 5.901l.244.487a.25.25 0 1 1-.448.224l-.008-.017c.008.11.02.202.037.29.054.27.161.488.419 1.003.288.578.235 1.15.076 1.629-.157.469-.422.867-.588 1.115l-.004.007a.25.25 0 1 1-.416-.278c.168-.252.4-.6.533-1.003.133-.396.163-.824-.049-1.246l-.013-.028c-.24-.48-.38-.758-.448-1.102a3 3 0 0 1-.052-.45l-.04.08a.25.25 0 1 1-.447-.224l.244-.487C4.789 10.227 3 7.837 3 5a5 5 0 0 1 10 0m-6.938-.495a2 2 0 0 1 1.443-1.443C7.773 2.994 8 2.776 8 2.5s-.226-.504-.498-.459a3 3 0 0 0-2.46 2.461c-.046.272.182.498.458.498s.494-.227.562-.495"/> </svg>' +
           '</a>'

        fetch(fileFile).then(response => response.text()).then(data => document.getElementById('content').innerHTML = marked.parse(data))
        
        tmpHtml = "<hr /><p>"        
        tmpHtml += '### <a href=\"mdfiles.html?tip=' + prevFile + '&dir=' + dirParam + '&nr=' + prevNr + '\"> PREV: ' + prevFile + '</a>'
        tmpHtml += ' ### <a href=\"./\"> HOME </a> '
        tmpHtml += ' ### <a href=\"mdfiles.html?tip=' + nextFile + '&dir=' + dirParam + '&nr=' + nextNr + '\"> NEXT: ' + nextFile + '</a> ###'         
        tmpHtml += "</p>"
    
        document.getElementById('next').innerHTML = '<p>' +  tmpHtml + '</p>'       
        
        document.title = 'Learnall ( ' +  curDir + ' )'
    })
}

// Calling from index.html
function prepareList (htmlprm, dirprm) {      
    fetchFilesList(dirprm + '.txt').then(list => {
        // console.log("List of files files:" + list);
        listFiles = list.split("\n")
        fileListMap.set(dirprm, listFiles)
        
        createMDList(htmlprm, dirprm);
        // createRawList(); // Not used for the time being
    })
    return listFiles
}

function createMDList(htmlprm, dirprm) {
  let tmpHtml = ''
  let nr=0
  listFiles = fileListMap.get(dirprm)
  listFiles.forEach(item => {
    base = item.replace(".md", "")
    if (base != '' && base != null) {
      tmpHtml += '<li><a href=\"mdfiles.html?tip=' + base + '&dir=' + dirprm + '&nr=' + nr + '\">' + base + '</a></li>'
      // console.log("TMP HTML: " + tmpHtml)
    }
    nr++
  });

  document.querySelector('#'+htmlprm).innerHTML = tmpHtml;
}

function getNextFile(nrPrm, dirprm) {  
    let nr = getValidNr(nrPrm, dirprm)
  // console.log("listFiles: " + listFiles)
    listFiles = fileListMap.get(dirprm)    
    let fileName = listFiles[nr];
    console.log("Asked for " + nr + " - NR calc: " + nr + " - filename-->" + fileName + "<--" )
    if (fileName.trim().length === 0) {
      console.log("Filename empty: " + fileName +"<--")
      nr = getValidNr(nr + 1, dirprm)      
      fileName = listFiles[nr];
      console.log("Filename was emtpy ... " + nr + " - NR calc: " + nr + " - filename-->" + fileName + "<--" )
    }

    return [fileName, nr]
}

function getPreviousFile(nrPrm, dirprm) {  
  let nr = getValidNr(nrPrm, dirprm)
// console.log("listFiles: " + listFiles)
  listFiles = fileListMap.get(dirprm)    
  let fileName = listFiles[nr];
  console.log("Asked for " + nr + " - NR calc: " + nr + " - filename-->" + fileName + "<--" )
  if (fileName.trim().length === 0) {
    console.log("Filename empty: " + fileName +"<--")
    nr = getValidNr(nr, dirprm)      
    fileName = listFiles[nr];
    console.log("Filename was emtpy ... " + nr + " - NR calc: " + nr + " - filename-->" + fileName + "<--" )
  }

  return [fileName, nr]
}



function getValidNr(nr, dirprm) {    
  listFiles = fileListMap.get(dirprm)
    // console.log("listFiles: " + listFiles)

    let nrValid = nr % listFiles.length;    

    if (nrValid < 0) {
      nrValid = listFiles.length - 2
    }

    console.log("getValidNr() - NR-param: " + nr + " - NR valid: " + nrValid)
    return nrValid
}


function createRawList() {
  let tmpHtml = ''
  listFiles.forEach(item => {
    base = item
    if (base != '' && base != null) {
      tmpHtml += '<li><a target=\"_blank\" href=\"files/' + base + '\">' + base + '</a></li>'
    }
  });

  document.querySelector("#ul_raw").innerHTML = tmpHtml;
}

