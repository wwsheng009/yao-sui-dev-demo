import { Process } from '@yaoapps/client' 

function ListDir(){
    console.log('ListDir')
    const fileList = Process('fs.app.ReadDir', 'public')

    
    // 对fileList进行处理，先把列表中所有的\替换成/，过滤掉__开头的目录，然后把/templates/default/去掉
    const newFileList = fileList.filter((file:string)=>{
        return !Process('fs.app.IsDir', file)
    }).map((file: string) => {
        return file.replace(/\\/g, '/').replace('/public/', '')
    }).filter((file: string) => {
        return file.endsWith('.sui')
    }).map((file: string) => {
        return file.replace(/.sui/g, '')
    })
    
    return newFileList
}