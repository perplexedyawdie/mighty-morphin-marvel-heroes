const spawn = require('child_process').spawn;
const path = require('path');
const py3Env = path.join(process.cwd(), 'face-morpher', 'env', 'bin', 'python3');
const faceMorpherDir = path.join(process.cwd(), 'face-morpher');
function morphMe(userImg, hero) {
    return new Promise((resolve, reject) => {
        alignImage(userImg, hero)
            .then((alignmentRes) => {
                // console.log(alignmentRes.search(userImg));
                let alignedUserImg = `${userImg.split('.')[0]}_01.png`;
                let outputName = `${userImg.split('.')[0]}.mp4`;
                return morphImage(alignedUserImg, hero, outputName);
            })
            .then((morphLocation) => {
                resolve(morphLocation)
            })
            .catch((err) => {
                reject(err)
            });
    })
}


function alignImage(userImg, hero) {
    return new Promise((resolve, reject) => {
        let alignOutput = ""
        let alignProcess = spawn(py3Env, [path.join(faceMorpherDir, 'code', 'utils', 'align_images.py'), 'images/', 'images/aligned_images', '--output_size=1024'], { cwd: faceMorpherDir }, { stdio: 'pipe' });
        alignProcess.stdout.on('data', function (data) {
            alignOutput = alignOutput + "\n" + data.toString();
            resolve(alignOutput)
            //code to handle data outpit
        });
        alignProcess.stdout.on('end', function () {
            alignProcess.kill('SIGTERM');

        });
        alignProcess.stderr.on('data', function (data) {
            console.log('err' + data.toString());
            reject(data.toString())
            //code to handle error output
        });
    })
}

function morphImage(alignedUserImg, hero, outputName) {
    let morphOutput = ""
    return new Promise((resolve, reject) => {
        try {
            let morphProcess = spawn(py3Env, [path.join(faceMorpherDir, 'code', '__init__.py'), '--img1', `images/aligned_images/${alignedUserImg}`, '--img2', `images/aligned_images/${hero}`, '--output', `${outputName}`], { cwd: faceMorpherDir }, { stdio: 'pipe' });
            morphProcess.stdout.on('data', function (data) {
                morphOutput = morphOutput + "\n" + data.toString();
                //code to handle data outpit
            });
            morphProcess.stdout.on('end', function () {
                morphProcess.kill('SIGTERM');
                console.log("done")

                resolve(path.join(faceMorpherDir,`${outputName}`))

            });
            morphProcess.stderr.on('data', function (data) {
                // console.log('err' + data.toString());

                //code to handle error output
            });

        } catch (error) {
            reject(error)
        }

    })

}

module.exports = morphMe;
