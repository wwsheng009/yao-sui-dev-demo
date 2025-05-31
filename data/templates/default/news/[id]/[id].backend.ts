import { Request } from "@yao/sui";

 function GetNew(r:Request){
    return {
        id: r.params.id,
        title: `新闻${r.params.id}`,
        author: '作者',
        date: '2023-01-01',
        content: '新闻详细内容...'
      };
}