# -*- coding: utf-8 -*-
"""云暖・旅居 部署包生成器 v2 —— 顶级 PM 细化版。
在 v1（8 主页面 + 16 州详情 + 共享资源）基础上新增：
  转化：全站悬浮咨询条 + 意向弹窗 + hero 电话按钮
  信任：stories(旅居故事·客群示意) / faq(FAQ+JSON-LD) / privacy / terms
  SEO：sitemap / robots / 404 / og·twitter·canonical / Organization JSON-LD / 州页 Place JSON-LD
  纵深：州页「何时去·适居判断」区块（基于温区推导·示意标注）
  质量：img 补 width/height 防 CLS / 返回顶部 / 表单校验增强 / 平滑滚动
数据 100% 忠实于品牌站原单文件；新增内容一律显式标注「示意 / 以合同为准」。
"""
import os, re, json

ROOT = "/home/user/Doubao/chats/38447038988828418/yun-nuan-luju"
DOMAIN = "https://example.com"   # 占位域名，上线替换（README 说明）

# ---------- 图片真实尺寸（读自文件，防 CLS） ----------
IMGSZ = {"yunnan-hero.webp": [1920,447],"baoshan-hero.jpg": [1600,1200],"chuxiong-hero.jpg": [1400,1050],"dali-hero.jpg": [1600,1200],"dehong-hero.jpg": [1600,1203],"destination-hero.jpg": [1920,1079],"diqing-hero.jpg": [1600,803],"erhai-cormorants.jpg": [1600,1200],"food-hero.jpg": [2000,857],"honghe-hero.jpg": [1600,1084],"kunming-hero.jpg": [1600,1066],"lijiang-hero.jpg": [1600,720],"lijiang-pagoda-snow.jpg": [1600,831],"lincang-hero.jpg": [1600,900],"nujiang-hero.jpg": [1600,900],"puer-hero.jpg": [1440,810],"qujing-hero.jpg": [1600,1060],"wenshan-hero.jpg": [1600,1199],"xishuangbanna-hero.jpg": [1280,960],"yuanyang-terraces.jpg": [1600,1067],"yunnan-hero.jpg": [1920,447],"yunnan-monastery.jpg": [1600,803],"yunnan-snowpeaks.jpg": [1920,864],"yuxi-hero.jpg": [1600,1066],"zhaotong-hero.jpg": [1600,1200]}
def img(src, alt, cls="", loading="lazy", fp=None):
    fn = src.rsplit("/",1)[-1]
    w,h = IMGSZ.get(fn,(1600,1200))
    c = f' class="{cls}"' if cls else ""
    p = f' fetchpriority="{fp}"' if fp else ""
    return f'<img src="{src}" alt="{alt}" width="{w}" height="{h}" loading="{loading}"{p}{c}>'

# ---------- 数据 ----------
IMG = {"yunnan":"yunnan-hero.webp","dest":"destination-hero.jpg","food":"food-hero.jpg",
  "snowpeaks":"yunnan-snowpeaks.jpg","cormorants":"erhai-cormorants.jpg","pagoda":"lijiang-pagoda-snow.jpg",
  "terraces":"yuanyang-terraces.jpg","monastery":"yunnan-monastery.jpg"}
REGIONS = [
  {"id":"nw","name":"滇西北","en":"Northwest Yunnan","note":"雪山 · 古城 · 高原牧场","states":["diqing","nujiang","lijiang"]},
  {"id":"w","name":"滇西","en":"West Yunnan","note":"苍洱 · 温泉 · 古镇","states":["dali","baoshan"]},
  {"id":"sw","name":"滇西南","en":"Southwest Yunnan","note":"傣乡 · 佤山 · 边城","states":["dehong","lincang"]},
  {"id":"s","name":"滇南","en":"South Yunnan","note":"茶山 · 雨林 · 傣乡","states":["puer","xishuangbanna"]},
  {"id":"c","name":"滇中","en":"Central Yunnan","note":"春城四季 · 高原慢生活","states":["chuxiong","kunming","yuxi"]},
  {"id":"ne","name":"滇东北","en":"Northeast Yunnan","note":"火腿之乡 · 乌蒙山","states":["qujing","zhaotong"]},
  {"id":"se","name":"滇东南","en":"Southeast Yunnan","note":"梯田 · 古城 · 喀斯特","states":["honghe","wenshan"]}]
# season：基于温区的气候常识推导，标注示意
SEASON = {
 "diqing":"夏凉宜避暑，冬严寒可看雪；昼夜温差大。","nujiang":"四季温暖湿润，峡谷地带秋冬更宜。",
 "lijiang":"四季分明，春秋两季最舒服。","dali":"四季如春，冬可避寒、夏可避暑。",
 "baoshan":"冬暖夏凉，温泉一年四季皆宜。","dehong":"冬暖夏热，冬季避寒正当时。",
 "lincang":"冬暖夏凉，茶山季节各有风味。","puer":"冬暖夏凉，云海与茶山四季可看。",
 "xishuangbanna":"冬季温暖，是南方避寒的经典之选。","chuxiong":"四季如春，菌子季最热闹。",
 "kunming":"四季如春，任何季节都好住。","yuxi":"四季如春，湖光四季不同。",
 "qujing":"冬冷夏凉，夏季宜避暑。","zhaotong":"冬寒夏凉，是云南的高原避暑地。",
 "honghe":"冬暖夏凉，梯田灌水季(冬春)景观佳。","wenshan":"冬暖夏凉，山水四季宜人。"}
STATES = [
 ("diqing","迪庆","Deqen · Land of Snow","香格里拉的静谧高处",["年均 6.3 ℃","最热 13.9 ℃","最冷 -2.3 ℃"],"夏长袖与薄外套 · 冬羽绒服","diqing-hero.jpg","香格里拉的高原味道：酥油茶暖身，牦牛肉干巴越嚼越香，松茸在雨季上桌。",["酥油茶配糌粑 · 牦牛肉干巴 · 琵琶肉","酥油茶 · 青稞饼 · 藏式包子","吉迪松茸 · 高山牦牛 · 尼西黑陶鸡","酥油茶 · 青稞酒 · 藏红花茶","糌粑 · 奶渣 · 烤土豆"]),
 ("nujiang","怒江","Nujiang · The Deep Valley","三江并流的峡谷人家",["年均 21 ℃","最热 26 ℃","最冷 15 ℃"],"夏短袖 · 冬短袖","nujiang-hero.jpg","峡谷里的家宴：漆油鸡温热，傈僳手抓饭摆满一桌，日子贴着江声过。",["漆油鸡 · 傈僳手抓饭 · 怒江鱼","荞麦粑粑 · 包谷稀饭 · 石板粑粑","高山老窝火腿 · 独龙牛 · 竹笋","杵酒 · 酥油茶 · 米酒","琵琶肉 · 荞饼 · 烤玉米"]),
 ("lijiang","丽江","Lijiang · Old Town & Snow","古城与雪山的对望",["年均 12.9 ℃","最热 18.6 ℃","最冷 6.0 ℃"],"夏短袖加薄外套 · 冬羽绒服","lijiang-hero.jpg","雪山下的古城，腊排骨在火塘边咕嘟，鸡豆凉粉配一碗酥油茶。",["腊排骨火锅 · 纳西烤鱼 · 黑山羊火锅","鸡豆凉粉 · 丽江粑粑 · 米灌肠","丽江雪桃 · 高山牦牛 · 野生菌","酥油茶 · 青稞酒 · 木瓜酒","丽江粑粑 · 纳西米糕 · 烤洋芋"]),
 ("dali","大理","Dali · Between Cangshan & Erhai","苍山洱海之间",["年均 15.1 ℃","最热 20.1 ℃","最冷 8.7 ℃"],"夏短袖薄衫 · 冬羽绒服","dali-hero.jpg","洱海边慢下来，乳扇的奶香配三道茶的苦甘，日子跟着苍山的云走。",["酸辣鱼 · 永平黄焖鸡 · 乳扇","扒肉饵丝 · 喜洲粑粑 · 凉鸡米线","苍山松茸 · 洱海弓鱼 · 诺邓火腿","三道茶 · 梅子酒 · 木瓜醋","烤乳扇 · 凉粉 · 雕梅"]),
 ("baoshan","保山","Baoshan · Volcanic Warmth","腾冲的温泉与古镇",["年均 15.9 ℃","最热 21.3 ℃","最冷 8.5 ℃"],"夏短袖薄衫 · 冬毛衣加外套","baoshan-hero.jpg","腾冲的温泉边城：稀豆粉配油条，火瓢牛肉一锅温热，银杏在秋日铺满巷。",["火瓢牛肉 · 大救驾 · 腾冲饵丝","稀豆粉 · 腾冲饵丝 · 烧肉米线","银杏果 · 固东豆腐 · 界头土鸡","温泉茶 · 苏子粑粑 · 木瓜醋","鲜花饼 · 荞糕 · 烤饵块"]),
 ("dehong","德宏","Dehong · Border Banyan Land","边境线上的傣乡",["年均 19.6 ℃","最热 24.0 ℃","最冷 12.2 ℃"],"夏短袖 · 冬薄外套","dehong-hero.jpg","瑞丽江畔的傣乡：撒撇开胃，泡鲁达清甜，芒市的烟火从烧烤摊升起。",["撒撇 · 傣味烤鸡 · 酸笋煮鱼","稀豆粉米线 · 泼水粑粑 · 竹筒饭","火烧干巴 · 树番茄 · 鸡枞","泡鲁达 · 柠檬水 · 糯米香茶","舂鸡脚 · 烤乳扇 · 撒苤"]),
 ("lincang","临沧","Lincang · Tea & Wa Land","佤乡与茶山",["年均 17.3 ℃","最热 21.6 ℃","最冷 11.2 ℃"],"夏短袖薄衫 · 冬薄外套","lincang-hero.jpg","佤乡与茶山之间：鸡肉烂饭一锅浓稠，舂鸡脚酸辣，冰岛的茶汤回甘。",["佤族鸡肉烂饭 · 舂鸡脚 · 火腿木瓜鸡","糯米饭团 · 豆豉米干 · 米线","冰岛茶鲜叶 · 佤山黑猪 · 鸡枞","冰岛茶 · 佤族水酒 · 米干汤","舂鱼 · 佤味烤串 · 稀饭"]),
 ("puer","普洱","Puer · Forest Tea Mountains","茶山雾里的栖居",["年均 19.3 ℃","最热 23.0 ℃","最冷 13.7 ℃"],"夏短袖薄衫 · 冬薄外套","puer-hero.jpg","茶山雾里过日子：哈尼蘸水鸡开胃，墨江紫米香糯，普洱的茶比日子更长。",["哈尼蘸水鸡 · 酸笋鸡 · 普洱豆汤米干","紫米米线 · 豆汤米干 · 糯米饭","普洱茶鲜叶 · 墨江紫米 · 小粒咖啡","普洱茶 · 小粒咖啡 · 酸角汁","舂干巴 · 烤糯玉米 · 芭蕉叶粑粑"]),
 ("xishuangbanna","西双版纳","Xishuangbanna · Rainforest","北回归线的雨林",["年均 21.8 ℃","最热 26.1 ℃","最冷 16.5 ℃"],"夏短袖短裤 · 冬薄外套","xishuangbanna-hero.jpg","雨林里的傣味：香茅草烤鱼带着草木香，柠檬撒清酸，夜晚交给烧烤摊。",["香茅草烤鱼 · 傣味酸肉 · 菠萝紫米饭","糯米饭团 · 竹筒饭 · 舂米线","热带水果 · 江鱼 · 野笋","柠檬撒 · 椰子水 · 傣家米酒","傣味烧烤 · 舂木瓜 · 烤鸡"]),
 ("chuxiong","楚雄","Chuxiong · Yi Heartland","彝州的山川旧事",["年均 15.6 ℃","最热 20.9 ℃","最冷 8.2 ℃"],"夏短袖 · 冬厚外套","chuxiong-hero.jpg","彝家的火塘与菌子：菌子火锅一锅鲜掉眉毛，坨坨肉在彝家宴上端上桌。",["菌子火锅 · 彝家坨坨肉 · 牟定腐乳","苦荞粑粑 · 米线 · 稀豆粉","野生菌 · 南华鸡枞 · 彝家腊肉","荞酒 · 米酒 · 普洱茶","烤洋芋 · 荞糕 · 烧饵块"]),
 ("kunming","昆明","Kunming · City of Eternal Spring","春城的晨昏",["年均 15.9 ℃","最热 20.7 ℃","最冷 9.3 ℃"],"夏短袖 · 冬厚外套","kunming-hero.jpg","省会不急，一碗米线从早吃到晚，菌子的香气在菜市里飘一整天。",["过桥米线 · 汽锅鸡 · 牛肝菌炒饭","烧饵块 · 豆花米线 · 稀豆粉油条","雨季见手青 · 松茸炖鸡 · 云南火腿","普洱茶 · 米凉虾 · 木瓜水","官渡粑粑 · 鲜花饼 · 烤乳扇"]),
 ("yuxi","玉溪","Yuxi · Lakes & Light","高原湖群的光",["年均 16.0 ℃","最热 20.8 ℃","最冷 8.5 ℃"],"夏夏装 · 冬外套","yuxi-hero.jpg","抚仙湖边慢城：鳝鱼米线一碗鲜，铜锅煮鱼守着湖，豆末糖甜得克制。",["鳝鱼米线 · 澄江铜锅鱼 · 抚仙湖铜锅洋芋饭","鳝鱼米线 · 稀饭 · 豆末糖","抚仙湖鱼 · 藕 · 青头菌","酸角汁 · 木瓜水 · 普洱茶","豆末糖 · 凉米线 · 烤藕片"]),
 ("qujing","曲靖","Qujing · Gateway of the East","珠江源头的辽阔",["年均 15.9 ℃","最热 19.9 ℃","最冷 7.1 ℃"],"夏短袖 · 冬厚外套","qujing-hero.jpg","宣威火腿的名乡：蒸饵丝油润，沾益辣子鸡辣得敞亮，火腿挂在老屋里。",["宣威火腿 · 沾益辣子鸡 · 蒸饵丝","蒸饵丝 · 稀豆粉 · 饵块","宣威火腿 · 罗平油菜籽 · 野生菌","罗平蜂蜜水 · 普洱茶 · 米酒","烤饵块 · 凉粉 · 麻花"]),
 ("zhaotong","昭通","Zhaotong · The Mighty Hills","乌蒙山的云上人家",["年均 11.7 ℃","最热 19.8 ℃","最冷 2 ℃"],"夏短袖加薄外套 · 冬羽绒服","zhaotong-hero.jpg","乌蒙山里的暖食：天麻炖鸡温补，昭通酱咸香，小肉串在夜市滋滋冒油。",["天麻炖鸡 · 昭通酱炒肉 · 坨坨肉","羊肉米线 · 稀豆粉 · 烧洋芋","天麻 · 昭通苹果 · 荞麦","苦荞茶 · 蜂蜜水 · 米酒","小肉串 · 烤洋芋 · 荞饼"]),
 ("honghe","红河","Honghe · Terraces of Light","元阳梯田的晨雾",["年均 18.6 ℃","最热 23.2 ℃","最冷 12.3 ℃"],"夏夏装 · 冬薄外套","honghe-hero.jpg","梯田与古城之间：蒙自过桥米线的汤头，建水烧豆腐的炭火，石屏豆腐一烤就香。",["蒙自过桥米线 · 建水汽锅鸡 · 石屏豆腐","过桥米线 · 烧豆腐 · 烤乳扇","哈尼梯田红米 · 建水紫陶 · 石榴","酸梅汤 · 木瓜水 · 普洱茶","建水烧豆腐 · 豆粉 · 草芽米线"]),
 ("wenshan","文山","Wenshan · Karst & Rivers","喀斯特的山水",["年均 18.4 ℃","最热 23 ℃","最冷 11 ℃"],"夏夏装 · 冬薄外套","wenshan-hero.jpg","三七之乡的滋补：三七汽锅鸡温润，岜夯鸡酸香，八宝米粒粒饱满。",["三七汽锅鸡 · 岜夯鸡 · 广南八宝米","米线 · 稀豆粉 · 粽粑","三七 · 丘北辣椒 · 八宝米","三七花茶 · 米酒 · 普洱茶","烧豆腐 · 酸汤 · 糍粑"]),
]
SVC = [
 ("01","迎接 · 安顿","每次入住当天","接站、入住办理、房屋家电讲解、本地生活地图（菜市 / 医院 / 药店 / 公交）。交付标准写入合同。"),
 ("02","日常 · 起居","每周 2–3 次","买菜（菜市代购或陪逛）、做饭协调（代请做饭阿姨或搭伙）、家政保洁调度；线上商城联动周边合作超市配送到门口。交付标准写入合同。"),
 ("03","健康 · 支持","按需","就医陪诊、挂号 / 预约协调、凭处方代取药、慢病提醒、体检预约；联动乡镇卫生院每周血压、血糖监测（不含任何诊疗）。交付标准写入合同。"),
 ("04","出行 · 调度","按需","用车调度（包车 / 拼车 / 司机）、活动预约、州际转场接送。交付标准写入合同。"),
 ("05","社交 · 活动","每周 1–2 次","市集 / 非遗工坊 / 茶会 / 徒步 / 社区活动组织、邻居介绍。交付标准写入合同。"),
 ("06","应急 · 响应","24 小时在线","水电报修、突发状况协调、应急联络。交付标准写入合同。"),
 ("07","家属 · 安心群","入住即建","把远方的儿女拉进家属安心群，邻里把爸妈的一天发进群——吃什么、去了哪、状态如何，一眼看得见。长期陪伴，无需每日提交简报。"),
]
DUR = [
 ("一周","7","天起","一地一地起步，先住进一个地方的日子，认识它的菜市场与晨光。"),
 ("半个月","15","天","两三个地方慢慢串，节奏更从容，一地一生活。"),
 ("一个月","30","天","把几个地方过成一段完整的生活，像本地人一样住下来。"),
]
FAQ = [
 ("怎么收费？","价格私人定制，因人、因季、因房型与管家服务浓度而定。总价包含所列全部服务项目及税费，除明示自选项目外不另行收取任何费用；签约前出具书面合同，逐项可勾选、可验收。"),
 ("最少能住多久？","体验包一地一周起，16 州自由组合、天数自填（一周 / 半个月 / 一个月随选随叠）。想住更久也完全可以——安居模式支持 15 天到数年。"),
 ("能安排接机 / 接站吗？","可以。入住当天是「安顿日」，管家完成生活接入：接站、入住办理、家电讲解、认菜市 / 医院 / 药店的路、建家属安心群——当天不安排任何景点。"),
 ("一个人来安全吗？","我们最看重这条。一地一管家、家属安心群让家人每天看得见、24 小时应急电话在线、随方案赠送或代购旅游意外险（含医疗）。医疗边界也写进合同：管家不做任何诊疗建议。"),
 ("跨州转场方便吗？","转场日安排上午动车、下午安顿，转场本身是景观路。下一站管家已备好入住与生活地图，行李与就医档案随行交接。"),
 ("老人在云南怎么就医？","就医陪诊负责陪同、预约、取药与传达，诊疗决策一律由执业医师作出；管家不做问诊、给药或治疗。按需提供慢病提醒、预约体检，联动乡镇卫生院每周血压、血糖监测（非诊疗）。"),
 ("能带宠物吗？","各院落政策不一。请在签约前告知，我们会按具体院落确认后再写入方案，不默认承诺。"),
 ("无障碍 / 特殊需求怎么提？","表单里的「特殊需求」或直接跟管家说明：无障碍、慢病提醒、饮食禁忌、单人陪住等，都会在方案中评估并落实。"),
 ("怎么付款？有退改政策吗？","签约前出具服务清单制合同，费用构成、付款方式与退改条款一并写入合同，逐项明示，不以口头约定为准。"),
 ("住在哪里？怎么保证真实？","在地民宿 / 精品院落，全部真实实拍；住宿合作方证照（特种行业许可证等）逐州可查。"),
]
STORIES = [
 ("给爸妈的一段云南日子","异地子女 · 安居","退休的父母在北方老家，冬天冷、空气差。做儿女的想让他们换个暖和干净的地方住一段，又怕没人照应。","管家接站入住后，把菜市场、卫生院、药店的路都带爸妈认了一遍；家属安心群把爸妈的早餐、散步、周末去哪都拍进来。做儿女的每天看一眼，悬着的心放下了。","异地陪伴 · 就医安心 · 家属安心群"),
 ("把三年没休的假，过成三个月","焕新居 · 数字游民","在上海做设计，工位格子间坐久了，想给日子透口气，又不愿彻底辞职。","住进大理的院子，网络与工位都安顿好。白天有本地朋友的饭局、傍晚有洱海的风。工作照做，人换了一种活法。","弹性排期 · 稳定网络 · 轻邻里"),
 ("退休后的第一个春天","活力银发 · 安居","老两口退休第一年，想去暖和的地方长住，又怕人生地不熟、看病麻烦。","先住西双版纳避寒，再串到普洱看茶山。管家安排陪诊、每周血压血糖监测，乡镇卫生院就在镇上。三个月住下来，比在家还踏实。","16 州组合 · 医养配套 · 长住无压力"),
]
PLEDGES = [
 ("壹","服务清单制合同","住宿地点、房型、天数、管家服务范围、用车、餐食与接送站逐项列明，总价包含所列全部服务项目及税费，除明示自选项目外不另行收取任何费用。"),
 ("贰","不安排任何购物场所","旅居生活不安排购物场所，不指定、不诱导、不强迫购买——购物需求完全由您自行决定。"),
 ("叁","无另行付费项目","不安排任何另行付费项目；您主动要求增加的项目，另行签订书面确认单并单独结算。"),
 ("肆","管家零回扣","管家及工作人员不从任何餐饮、交通、住宿推荐中获取回扣或返利，违者按合同约定双倍退还相应费用。"),
 ("伍","违约可主张","违反上述承诺的，您有权要求退还相应费用（参照《旅游法》第 35 条精神，行程结束后 30 日内主张）。以上为乙方经营承诺条款，非免责条款。"),
]
INSURES = [
 ("壹","旅游意外伤害险（含医疗）","随产品赠送 / 代购，覆盖全程。"),
 ("贰","公众责任险 / 场所责任险","覆盖住宿场所内人身财产损失。"),
 ("叁","管家雇主责任险 / 工伤保险","每位管家在册在保。"),
]

ST = {s[0]: dict(id=s[0],cn=s[1],en=s[2],desc=s[3],temps=s[4],dress=s[5],img=s[6],foodIntro=s[7],
  food=dict(dish=s[8][0],bf=s[8][1],season=s[8][2],drink=s[8][3],street=s[8][4])) for s in STATES}
STATES = list(ST.values())
def region_of(stid):
    for r in REGIONS:
        if stid in r["states"]: return r
    return None

# ---------- 公共片段 ----------
def check_icon(color=""):
    return ('<svg viewBox="0 0 24 24" aria-hidden="true"' + (' style="color:var(--earthen-deep);"' if color=="earthen" else "") + '><path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>')
def brand_svg():
    return ('<svg class="brand-seal" viewBox="0 0 64 64" aria-hidden="true"><rect x="3" y="3" width="58" height="58" rx="10" fill="currentColor"/><path d="M14 47 L27 24 L33 35 L39 26 L50 47 Z" fill="#EDE6D8"/><path d="M12 51 H52" stroke="#EDE6D8" stroke-width="3" stroke-linecap="round" opacity="0.9"/></svg>')
def mountain_divider():
    return ('<svg class="mountain-divider" viewBox="0 0 1440 120" preserveAspectRatio="none" aria-hidden="true"><path class="ridge-far" d="M0 86 L220 38 L420 74 L660 20 L900 72 L1140 32 L1440 68 V120 H0 Z"/><path class="ridge-near" d="M0 104 L300 66 L560 92 L860 56 L1140 90 L1440 64 V120 H0 Z"/><path class="mist-line" d="M0 76 C360 58 1080 56 1440 74"/></svg>')
NAV = [("首页","index.html"),("目的地","destination.html"),("体验包","experience.html"),
  ("旅居总管","concierge.html"),("生活方式","living.html"),("美食","food.html"),("信任","trust.html"),("联系","contact.html")]
def nav_html(base, active):
    return "".join(f'<li><a href="{base}{page}" data-nav{" class=\"is-active\"" if name==active else ""}>{name}</a></li>' for name,page in NAV)
def header_html(base, active):
    return (f'<header class="site-header"><div class="header-inner"><a class="brand" href="{base}index.html" data-nav aria-label="云暖・旅居 · 返回首页">{brand_svg()}<span class="brand-name">云暖・旅居</span></a>'
        f'<button class="nav-toggle" type="button" aria-expanded="false" aria-controls="site-nav" aria-label="打开菜单"><svg class="icon-menu" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg><svg class="icon-close" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg></button>'
        f'<nav id="site-nav" class="site-nav" aria-label="全站导航"><button class="nav-close" type="button" aria-label="关闭菜单">×</button><ul>{nav_html(base, active)}</ul></nav></div></header>')
def footer_html(base):
    return (f'<footer class="site-footer"><div class="wrap"><div class="footer-grid">'
        f'<div class="brand-col"><a class="brand" href="{base}index.html" data-nav>{brand_svg()}<span class="brand-name">云暖・旅居</span></a>'
        f'<p>旅居（长住）品牌 · 2012 年起。不是来看云南，是住进云南的日子。服务清单与医疗边界写进合同。</p></div>'
        f'<div><h3>站点</h3><ul>'
        f'<li><a href="{base}destination.html" data-nav>目的地 · 16 州版图</a></li>'
        f'<li><a href="{base}experience.html" data-nav>旅居体验包</a></li>'
        f'<li><a href="{base}stories.html" data-nav>旅居故事</a></li>'
        f'<li><a href="{base}food.html" data-nav>味觉版图</a></li>'
        f'<li><a href="{base}trust.html" data-nav>信任中心</a></li></ul></div>'
        f'<div><h3>了解</h3><ul>'
        f'<li><a href="{base}concierge.html" data-nav>旅居总管</a></li>'
        f'<li><a href="{base}living.html" data-nav>生活方式</a></li>'
        f'<li><a href="{base}faq.html" data-nav>常见问题</a></li>'
        f'<li><a href="{base}contact.html" data-nav>联系管家</a></li></ul></div>'
        f'<div><h3>合规</h3><ul>'
        f'<li><a href="{base}privacy.html" data-nav>隐私政策</a></li>'
        f'<li><a href="{base}terms.html" data-nav>服务条款</a></li>'
        f'<li class="tel">王先生 · 132 0888 8618</li>'
        f'<li class="tel">白先生 · 177 8728 8800</li></ul></div></div>'
        f'<div class="footer-bottom"><span>© 2026 云暖・旅居 · 在云南，住进日子</span>'
        f'<span class="credit">主视觉摄影：玉龙雪山群峰 · Wikimedia Commons（CC BY-SA 3.0）</span>'
        f'<span class="legal">ICP 备案号：沪ICP备XXXXXXXX号（上线前替换）· 云暖旅居（示例）</span></div></div></footer>')

def jsonld_org():
    return ('<script type="application/ld+json">'+json.dumps({
        "@context":"https://schema.org","@type":"Organization","name":"云暖·旅居",
        "description":"云南旅居（长住）品牌：旅居体验包、旅居总管、焕新居与安居。2012 年起，在云南住进日子。",
        "telephone":"+86-132-0888-8618","url":DOMAIN,"areaServed":"云南" }, ensure_ascii=False)+'</script>')
def head_html(base, title, desc, active, canonical_rel, extra_jsonld=""):
    canon = DOMAIN + canonical_rel
    og = ('<meta property="og:type" content="website"><meta property="og:site_name" content="云暖・旅居">'
          f'<meta property="og:title" content="{title}"><meta property="og:description" content="{desc}">'
          f'<meta property="og:url" content="{canon}">'
          f'<meta property="og:image" content="{DOMAIN}/assets/img/yunnan-hero.jpg">'
          '<meta name="twitter:card" content="summary_large_image">'
          f'<meta name="twitter:title" content="{title}"><meta name="twitter:description" content="{desc}">'
          f'<link rel="canonical" href="{canon}">')
    return (f'<!DOCTYPE html>\n<html lang="zh-CN" data-base="{base}">\n<head>\n'
        f'<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1">\n'
        f'<title>{title}</title>\n<meta name="description" content="{desc}">\n{og}\n'
        f'<link rel="icon" type="image/svg+xml" href="{base}favicon.svg">\n'
        f'<link rel="apple-touch-icon" href="{DOMAIN}/assets/img/yunnan-hero.jpg">\n'
        '<link rel="stylesheet" href="https://miaoda.feishu.cn/fonts/css2?family=Noto+Serif+SC:wght@400;600;700;900&family=Noto+Sans+SC:wght@300;400;500;700&display=swap">\n'
        f'<link rel="stylesheet" href="{base}assets/css/style.css">\n{jsonld_org()}{extra_jsonld}\n</head>\n<body>\n'
        '<a class="skip-link" href="#main">跳到正文</a>\n')

def sticky_cta(base):
    return (f'<div class="sticky-cta" id="sticky-cta" role="region" aria-label="快捷咨询">'
        f'<button class="back-top" id="back-top" type="button" aria-label="返回顶部"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 19V5M5 12l7-7 7 7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></button>'
        f'<a class="cta-chip cta-call" href="tel:13208888618" aria-label="拨打王先生"><span class="ic"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.6 3h3l1.6 4-2 1.5a12 12 0 0 0 5.3 5.3l1.5-2 4 1.6v3A2 2 0 0 1 18 18 15 15 0 0 1 3 6a2 2 0 0 1 2-2z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg></span><span class="lbl">132 0888 8618</span></a>'
        f'<button class="cta-chip cta-lead" id="cta-lead" type="button" aria-haspopup="dialog" aria-label="在线留言"><span class="ic"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6h16v10H7l-3 3z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M8 10h8M8 13h5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg></span><span class="lbl">在线留言</span></button>'
        f'</div>'
        f'<div class="lead-modal" id="lead-modal" hidden><div class="lead-card" role="dialog" aria-modal="true" aria-labelledby="lead-title">'
        f'<button class="lead-close" id="lead-close" type="button" aria-label="关闭">×</button>'
        f'<h3 id="lead-title">发一句「我想去云南」</h3><p class="lead-sub">10 分钟内回复 · 也可以直接拨打王先生 132 0888 8618</p>'
        f'<form id="lead-form"><label>称呼 <span class="req">*</span><input name="lead-name" type="text" required maxlength="30" placeholder="怎么称呼您"></label>'
        f'<label>联系方式（电话 / 微信）<span class="req">*</span><input name="lead-contact" type="text" required maxlength="40" placeholder="手机号或微信号"></label>'
        f'<label>想住哪 / 住多久（选填）<textarea name="lead-idea" maxlength="200" placeholder="如：给爸妈安排一段云南日子"></textarea></label>'
        f'<button type="submit" class="btn btn--earthen">提交给管家</button>'
        f'<p class="lead-note">提交即表示同意<strong>隐私政策</strong>：信息仅用于定制行程与管家联系，不会对外披露或用于营销推送。</p>'
        f'<div class="lead-ok" id="lead-ok" role="status" hidden>已收到，管家会在 10 分钟内与您联系。</div></form></div></div>')

def tail_html(base, js=True):
    return (footer_html(base) + sticky_cta(base) +
        (f'\n<script src="{base}assets/js/main.js"></script>\n' if js else "") +
        '\n</body>\n</html>\n')
def page_doc(base, title, desc, active, canon, main, extra_jsonld="", js=True):
    return (head_html(base, title, desc, active, canon, extra_jsonld) + header_html(base, active) +
        '<main id="main">' + main + '</main>\n' + tail_html(base, js))

# ---------- 组件 ----------
def state_card(s, base):
    r = region_of(s["id"])
    return (f'<a class="state-card" href="{base}places/{s["id"]}.html" data-nav>'
        f'<div class="ph"><span class="region-tag">{r["name"]}</span>{img(base+"assets/img/"+s["img"], s["cn"]+"风光："+s["desc"])}</div>'
        f'<div class="body"><span class="cn">{s["cn"]}</span><div class="side">'
        f'<span class="en">{s["en"]}</span><p class="desc">{s["desc"]}</p>'
        f'<p class="temp">{s["temps"][0]} · {s["temps"][1]} · {s["temps"][2]}</p></div></div></a>')
def cta_band(base, title, sub):
    return (f'<section class="cta-band"><div class="wrap"><div class="section-head"><p class="eyebrow eyebrow--on-dark">云暖・旅居 · 2012 年起</p>'
        f'<h2 class="h2">{title}</h2><p class="lede">{sub}</p></div><div class="cta-actions">'
        f'<a class="btn btn--earthen" href="{base}contact.html" data-nav>聊聊你的云南日子</a>'
        f'<a class="btn btn--ghost" href="{base}experience.html" data-nav>先看旅居体验包</a></div>'
        f'<div class="cta-tels"><div><div class="t">王先生</div><div class="num">132 0888 8618</div></div>'
        f'<div><div class="t">白先生</div><div class="num">177 8728 8800</div></div></div></div></section>')
def belt(title, sub):
    return f'<div class="belt"><h3>{title}</h3><span class="sub">{sub}</span></div>'
def composer_html(base):
    state_btns = "".join(f'<button type="button" class="tag-btn" data-id="{s["id"]}" aria-pressed="false">{s["cn"]}</button>' for s in STATES)
    dur_btns = "".join(f'<button type="button" class="tag-btn {"is-on" if d[1]=="7" else ""}" data-dur="{d[1]}">{d[0]} · {d[1]} 天</button>' for d in DUR)
    return (belt("自选组合","点选地州，定下停留时长") +
        '<div class="composer"><div class="composer-head"><h3>我的组合清单</h3><p>16 个地州自由选，串成你自己的线路。提交后 10 分钟内回复 · 长途大交通不安排 · 价格私人定制。</p></div>'
        '<div class="composer-body"><div class="choose-tags" id="pick-tags">'+state_btns+'</div>'
        '<div class="choose-tags" id="dur-tags" role="group" aria-label="停留时长">'+dur_btns+'</div>'
        '<div class="composer-inputs">'
        '<label class="ci"><span>出游人数</span><select id="inp-pax">'
        '<option value="1 人">1 人</option><option value="2 人" selected>2 人</option>'
        '<option value="3-4 人（家庭）">3-4 人（家庭）</option><option value="5 人以上">5 人以上</option>'
        '</select></label>'
        '<label class="ci"><span>计划出发</span><input type="date" id="inp-start" aria-label="计划出发日期"></label>'
        '</div>'
        '<p class="composer-q">住宿类型</p><div class="choose-tags" id="stay-tags" role="group" aria-label="住宿类型">'
        '<button type="button" class="tag-btn is-on" data-stay="民宿（一室一厅一厨一卫）" aria-pressed="true">民宿·一居</button>'
        '<button type="button" class="tag-btn" data-stay="民宿（二室一厅）" aria-pressed="false">民宿·两居</button>'
        '<button type="button" class="tag-btn" data-stay="酒店·四钻" aria-pressed="false">酒店·四钻</button>'
        '<button type="button" class="tag-btn" data-stay="酒店·五钻" aria-pressed="false">酒店·五钻</button>'
        '<button type="button" class="tag-btn" data-stay="客栈" aria-pressed="false">客栈</button>'
        '<button type="button" class="tag-btn" data-stay="度假村" aria-pressed="false">度假村</button>'
        '<button type="button" class="tag-btn" data-stay="农家院" aria-pressed="false">农家院</button>'
        '</div>'
        '<p class="composer-q">想体验的日常（可多选）</p><div class="choose-tags" id="exp-tags" role="group" aria-label="体验偏好">'
        '<button type="button" class="tag-btn" data-exp="文化" aria-pressed="false">文化</button>'
        '<button type="button" class="tag-btn" data-exp="艺术" aria-pressed="false">艺术</button>'
        '<button type="button" class="tag-btn" data-exp="非遗体验" aria-pressed="false">非遗体验</button>'
        '<button type="button" class="tag-btn" data-exp="农耕养殖" aria-pressed="false">农牧·农耕</button>'
        '</div>'
        '<p class="composer-q">需要的在地服务（可多选）</p><div class="choose-tags" id="svc-tags" role="group" aria-label="增值服务">'
        '<button type="button" class="tag-btn" data-svc="健康监测" aria-pressed="false">健康监测</button>'
        '<button type="button" class="tag-btn" data-svc="护理护工保姆" aria-pressed="false">护理/护工/保姆</button>'
        '<button type="button" class="tag-btn" data-svc="车辆接驳" aria-pressed="false">车辆接驳</button>'
        '<button type="button" class="tag-btn" data-svc="安神助眠包" aria-pressed="false">安神助眠包</button>'
        '<button type="button" class="tag-btn" data-svc="起居管家" aria-pressed="false">起居管家</button>'
        '</div>'
        '<div class="composer-actions">'
        '<button class="btn btn--earthen" type="button" id="composer-generate">生成我的定制方案</button>'
        '<button class="btn btn--ink btn--sm" type="button" id="composer-clear">清空</button></div>'
        '<div class="composer-result" id="composer-result"></div>'
        '<p class="composer-note">结合板块、季节、房型与管家服务浓度定价，价格为私人定制；长途大交通不安排，板块内短程转场由管家衔接。</p></div></div>')

# ---------- 页面 main ----------
def hero_kicker(txt):
    return f'<p class="hero-kicker"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3l9 16H3z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>{txt}</p>'
def main_home(base):
    cards = "".join(state_card(s, base) for s in STATES)
    faq_preview = "".join(f'<div class="faq-item"><h3><button type="button" aria-expanded="false">{q}</button></h3><div class="faq-a"><p>{a}</p></div></div>' for q,a in FAQ[:5])
    story_preview = "".join(f'<a class="story-mini" href="{base}stories.html" data-nav><span class="who">{s[2]}</span><h3>{s[0]}</h3><p>{s[4]}</p></a>' for s in STORIES[:3])
    return (
      f'<section class="hero"><div class="hero-media-wrap">{img(base+"assets/img/"+IMG["yunnan"], "梅里雪山群峰全景：白雪覆盖的山脊在湛蓝天空下连绵起伏", cls="hero-media", loading="eager", fp="high")}</div>'
      '<div class="hero-scrim" aria-hidden="true"></div>'
      '<div class="hero-seal" aria-hidden="true"><svg viewBox="0 0 64 64"><rect x="2" y="2" width="60" height="60" rx="12" fill="none" stroke="currentColor" stroke-width="3"/><rect x="9" y="9" width="46" height="46" rx="9" fill="currentColor"/><text x="32" y="40" text-anchor="middle" font-size="15" font-weight="900" fill="#FFF7EC" font-family="\'Noto Serif SC\',serif">云暖</text></svg></div>'
      '<div class="hero-content wrap">'+hero_kicker("云暖・旅居 · 2012 年起")+
      '<h1 class="hero-title"><span class="hl">在云南，</span><span class="hl">住进日子</span></h1>'
      '<p class="hero-sub">不是来看云南，是住进云南的日子。</p>'
      '<p class="hero-foot">旅居体验包一地一周起，一地一旅居总管——买菜、就医、水电、琐碎，有人替你接住。</p>'
      '<div class="hero-actions">'
      f'<a class="btn btn--earthen" href="{base}experience.html" data-nav>旅居体验包 · 一周起</a>'
      f'<a class="btn btn--ghost" href="{base}living.html" data-nav>焕新居 · 给日子透口气</a>'
      f'<a class="btn btn--ghost" href="{base}living.html" data-nav>安居 · 退休换地方住</a>'
      f'<a class="btn btn--call" href="tel:13208888618"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.6 3h3l1.6 4-2 1.5a12 12 0 0 0 5.3 5.3l1.5-2 4 1.6v3A2 2 0 0 1 18 18 15 15 0 0 1 3 6a2 2 0 0 1 2-2z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg><span>立即咨询 · 132 0888 8618</span></a></div></div></section>'
      + mountain_divider() +
      '<section class="section"><div class="wrap"><div class="section-head section-head--center"><p class="eyebrow">四个词，说清旅居</p><h2 class="h2">慢、住、吃、人</h2><p class="lede">旅居不是换一个地方旅游，是换一种方式过日子。</p></div>'
      '<div class="words-grid"><div class="word-cell"><span class="word-char">慢</span><h3>慢是设计出来的</h3><p>一天一件生活主题，剩下的时间还给晨光与风。</p></div>'
      '<div class="word-cell"><span class="word-char">住</span><h3>住是筛出来的</h3><p>精品院落，认得你的早点摊，住成这里的日常。</p></div>'
      '<div class="word-cell"><span class="word-char">吃</span><h3>吃是跟着本地人走的</h3><p>菜市场日、朋友家饭局日，不是菜单是生活。</p></div>'
      '<div class="word-cell"><span class="word-char">人</span><h3>人是始终在的</h3><p>一地一管家，买菜就医琐碎全接住，家人每日看得见。</p></div></div></div></section>'
      '<section class="section section--deep"><div class="wrap"><div class="section-head section-head--center"><p class="eyebrow">两种生活方式</p><h2 class="h2">为追寻而来，为安住而来</h2><p class="lede">同样在云南住进日子，换一种过法。</p></div><div class="ways">'
      f'<article class="way-card"><div class="way-media"><span class="way-tag">REVIVE · 湖山边的院子</span>{img(base+"assets/img/"+IMG["snowpeaks"], "雪山前的湖泊与院落")}</div>'
      '<div class="way-body"><p class="en">焕新居</p><h3>给日子透口气</h3><p>生活卡在同一条轨道上太久，来云南给日子透口气。网络、住处、社群都安顿好，剩下的交给自由——不用辞职，也能换一口气。</p>'
      f'<a class="btn btn--ink btn--sm" href="{base}living.html" data-nav>了解焕新居</a></div></article>'
      f'<article class="way-card"><div class="way-media"><span class="way-tag">SETTLE · 雨林里的日子</span>{img(base+"assets/img/"+IMG["monastery"], "云南寺院檐角与远山")}</div>'
      '<div class="way-body"><p class="en">安居</p><h3>退休换地方住</h3><p>家乡冬天冷、空气欠佳？退休了换个暖和、干净的地方住。16 个地州自由组合、不赶路，邻里接住买菜、就医，家属安心群让儿女每天看得见。</p>'
      f'<a class="btn btn--ink btn--sm" href="{base}living.html" data-nav>了解安居</a></div></article></div></div></section>'
      '<section class="section"><div class="wrap"><div class="section-head"><p class="eyebrow">旅居体验包 · 自选组合</p><h2 class="h2">每个地方，<em>最少住一周</em></h2><p class="lede">以生活模式，真实体验当地的生活与温度——用生活感，而不是行程表。16 个地州自由选，串成你自己的线路。</p></div><div class="steps">'
      '<div class="step"><h3>安顿日</h3><p>管家完成「生活接入」：接站入住、家电讲解、办生活卡、认菜市 / 医院 / 药店的路，见管家与邻居——当天不安排任何景点。</p></div>'
      '<div class="step"><h3>生活日</h3><p>每日 1 件生活主题（菜市场日 / 朋友家饭局日 / 温泉日 / 非遗工坊日），其余时间还给晨光与风；邻里把日常发进家属安心群。</p></div>'
      '<div class="step"><h3>转场日</h3><p>上午动车，下午安顿。转场本身是景观路；下一站管家已备好入住与生活地图，行李与就医档案随行交接。</p></div></div>'
      + belt("每天一件生活主题","日子自己长出来") +
      '<div class="topics"><div class="topic"><span class="num">壹</span><h3>菜市场日</h3><p>跟管家认摊、买当季菜，回来做一顿家常饭。</p></div>'
      '<div class="topic"><span class="num">贰</span><h3>朋友家饭局日</h3><p>去本地人家做客，吃一顿真正的家常饭。</p></div>'
      '<div class="topic"><span class="num">叁</span><h3>温泉日</h3><p>把高原的风泡进身体里，慢慢待一下午。</p></div>'
      '<div class="topic"><span class="num">肆</span><h3>非遗工坊日</h3><p>白族扎染、纳西东巴、藏地手作——学一样带回家。</p></div></div></div></section>'
      '<section class="section section--mist"><div class="wrap"><div class="section-head"><p class="eyebrow">16 州 · 自由搭配</p><h2 class="h2">16 片土地，<em>16 种日子</em></h2><p class="lede">版图是身份，不是路线。它是连绵千里的群山，是分属不同季风的河谷与高原，是 16 片土地各自生长出来的呼吸与烟火。不必一次看完——先读懂它的每一面，再选择一处，安顿下来。</p></div>'
      f'<div class="state-grid">{cards}</div>'
      f'<div style="margin-top:1.8rem;"><a class="btn btn--earthen" href="{base}experience.html" data-nav>生成我的组合，发给管家</a><a class="btn btn--ink" href="{base}destination.html" data-nav>看看 16 州版图</a></div></div></section>'
      '<section class="section"><div class="wrap"><div class="section-head"><p class="eyebrow">被接住的日子</p><h2 class="h2">旅居故事 · <em>不是我们的，是住进来的人</em></h2><p class="lede">三种最常见的来法，三种被接住的样子。以下为典型客群旅程梳理（示意），不指向具体个人；真实个案以签约沟通为准。</p></div>'
      f'<div class="story-mini-grid">{story_preview}</div>'
      f'<div style="margin-top:1.4rem;"><a class="btn btn--earthen" href="{base}stories.html" data-nav>读完整故事</a></div></div></section>'
      '<section class="section section--mist"><div class="wrap"><div class="section-head"><p class="eyebrow">常见问题</p><h2 class="h2">签约前，<em>先把想问的问了</em></h2></div>'
      f'<div class="faq-list">{faq_preview}</div>'
      f'<div style="margin-top:1.4rem;"><a class="btn btn--ink" href="{base}faq.html" data-nav>看全部 10 问</a></div></div></section>'
      + cta_band(base,"先选一块地，住下来","聊聊你想住的地方、住多久——剩下的，交给云南的院子。"))

def main_destination(base):
    blocks = ""
    for r in REGIONS:
        blocks += belt(r["name"], f'{r["en"]} · {r["note"]}') + '<div class="state-grid">' + "".join(state_card(ST[i], base) for i in r["states"]) + '</div>'
    return (
      f'<section class="hero" style="min-height:52vh;"><div class="hero-media-wrap">{img(base+"assets/img/"+IMG["dest"], "云南梯田与河谷风光", cls="hero-media")}</div><div class="hero-scrim" aria-hidden="true"></div>'
      '<div class="hero-content wrap">'+hero_kicker("目的地 · 云南全境")+'<h1 class="hero-title"><span class="hl">版图是身份，</span><span class="hl">不是路线</span></h1><p class="hero-sub">16 片土地，16 种日子。</p></div></section>'
      + mountain_divider() +
      '<section class="section"><div class="wrap"><div class="section-head"><p class="eyebrow">触摸山河</p><h2 class="h2">每一处，<em>都住得进日子</em></h2><p class="lede">按区域分组，各自生长。气候、穿衣，先看清楚，再慢慢选。</p></div>'
      + blocks + '</div></section>' + cta_band(base,"不必一次看完，择一处，安顿下来","16 州自由组合，一周起、天数自填。想去哪住、住多久，自己定。"))

def place_jsonld(s, r):
    return ('<script type="application/ld+json">'+json.dumps({
        "@context":"https://schema.org","@type":"TouristDestination","name":s["cn"],
        "description":s["desc"],"alternateName":s["en"],"url":DOMAIN+"/places/"+s["id"]+".html",
        "containedInPlace":{"@type":"AdministrativeArea","name":r["name"]+"（云南）"}}, ensure_ascii=False)+'</script>')
def main_place(base, sid):
    s = ST[sid]; r = region_of(sid)
    return (
      f'<section class="place-hero">{img(base+"assets/img/"+s["img"], s["cn"]+"风光："+s["desc"])}<div class="scrim" aria-hidden="true"></div>'
      f'<div class="inner wrap"><a class="crumb" href="{base}destination.html" data-nav>← 返回 16 州版图</a><h1>{s["cn"]}</h1><p class="en">{s["en"]}</p></div></section>'
      '<section class="section"><div class="wrap"><div class="facts place-facts">'
      f'<div class="fact"><div class="k">地区</div><div class="v">{r["name"]}</div></div>'
      f'<div class="fact"><div class="k">一句话</div><div class="v">{s["desc"]}</div></div>'
      f'<div class="fact"><div class="k">穿衣</div><div class="v">{s["dress"]}</div></div>'
      f'<div class="fact"><div class="k">温度</div><div class="v">{s["temps"][0]} · {s["temps"][1]} · {s["temps"][2]}</div></div></div>'
      '<div style="height:2.2rem;"></div>'
      + belt("何时去 · 适居判断","示意参考，具体以当年气候与管家建议为准") +
      f'<div class="when"><p>{SEASON[sid]}</p><p class="tip">入住前，管家会结合当年气候给出更具体的穿衣与生活建议。</p></div>'
      '<div style="height:2.2rem;"></div><div class="place-food">'
      f'<h3>{s["cn"]} · 当地味道</h3><dl>'
      f'<div><dt>代表菜</dt><dd>{s["food"]["dish"]}</dd></div>'
      f'<div><dt>早点</dt><dd>{s["food"]["bf"]}</dd></div>'
      f'<div><dt>时鲜</dt><dd>{s["food"]["season"]}</dd></div>'
      f'<div><dt>一杯</dt><dd>{s["food"]["drink"]}</dd></div>'
      f'<div><dt>街头</dt><dd>{s["food"]["street"]}</dd></div></dl></div>'
      + belt("旅居此地","怎么住 · 谁接住日子") +
      '<div class="ways">'
      f'<article class="way-card"><div class="way-body"><p class="en">怎么住</p><h3>在{s["cn"]}住进日子</h3><p>体验包一地一周起、16 州自由组合、天数自填。{s["cn"]}可以住很久，也可以串起相邻板块的温泉、古镇与茶山。</p>'
      f'<a class="btn btn--earthen btn--sm" href="{base}experience.html" data-nav>看旅居体验包</a></div></article>'
      '<article class="way-card"><div class="way-body"><p class="en">谁接住日子</p><h3>一地一旅居总管</h3><p>买菜、就医陪诊、水电报修、应急响应。日常 2 小时到场，应急 24 小时电话在线（以合同为准）。</p>'
      f'<a class="btn btn--ink btn--sm" href="{base}concierge.html" data-nav>了解旅居总管</a></div></article></div>'
      f'<div style="height:1.6rem;"></div><a class="btn btn--earthen btn--sm" href="{base}contact.html" data-nav>想住{s["cn"]} · 聊聊</a></div></section>')

def main_experience(base):
    tiers_feature = ["精品院落 / 设计民宿，一处一地","一名贴身旅居总管（服务清单写入合同）","板块内短程转场与接驳","每日一件生活主题 + 定制生活接入","邻里把日常发进家属安心群","就医陪诊、用车、家政等七层管家服务","旅游意外险（含医疗），保险方案随合同确认"]
    tiers_daily = ["在地民宿 / 院落住宿，一处一地","一名在地旅居总管（服务清单写入合同）","板块内短程转场与接驳","每日一件生活主题 + 在地生活接入","邻里把日常发进家属安心群","就医陪诊、用车、家政等七层管家服务","旅游意外险（含医疗），保险方案随合同确认"]
    return (
      '<section class="section"><div class="wrap"><div class="section-head"><p class="eyebrow">旅居体验包</p><h2 class="h2">一地一周起，<em>自由组合</em></h2><p class="lede">以生活模式，真实体验当地的生活与温度——不是赶景点，是住进日子。一周 / 半个月 / 一个月，随选随叠 · 私人定制。</p></div>'
      '<div class="tiers">'
      '<article class="tier tier--feature"><span class="flag">精品居 · 讲究之选</span><h3>把生活过成一件值得讲究的事</h3><p class="tagline">好院子、好管家、好细节——精品居一地一周起 · 自由叠加 · 板块内生活。</p><ul>'
      + "".join(f'<li>{check_icon()}{t}</li>' for t in tiers_feature) +
      f'<p class="price">价格 · 私人定制</p><a class="btn btn--earthen" href="{base}contact.html" data-nav>聊聊精品居</a></ul></article>'
      '<article class="tier"><span class="flag">日常居 · 自在之选</span><h3>不摆排场，把日子过顺</h3><p class="tagline">日常居接住买菜、就医与琐碎，剩下的交给你——不便宜在豪华，便宜在有人替你过日子。</p><ul>'
      + "".join(f'<li>{check_icon()}{t}</li>' for t in tiers_daily) +
      f'<p class="price">价格 · 因人因季而定</p><a class="btn btn--ink" href="{base}contact.html" data-nav>聊聊日常居</a></ul></article></div>'
      + belt("三种节奏","随选随叠 · 自由组合") +
      '<div class="durs">' + "".join(f'<div class="dur"><div class="n">{d[1]}<span class="unit"> {d[2]}</span></div><p>{d[0]}</p><p style="margin-top:.2rem;font-size:var(--fs-xs);">{d[3]}</p></div>' for d in DUR) + '</div>' +
      composer_html(base) + '</div></section>')

def main_concierge(base):
    svc_rows = "".join(f'<div class="svc"><span class="no">{s[0]}</span><div><h3>{s[1]}<span class="freq">{s[2]}</span></h3><p>{s[3]}</p></div><span aria-hidden="true"></span></div>' for s in SVC)
    return (
      '<section class="section section--mist"><div class="wrap"><div class="section-head"><p class="eyebrow">旅居总管 · 2012 年起</p><h2 class="h2">一地一管家，<em>接住日常琐碎</em></h2><p class="lede">不是酒店礼宾，是陪买菜认摊、代约挂号陪诊、水电报修、应急响应的在地人。本地生活熟手 + 服务清单交付标准培训 + 家属安心群制度；不上岗先考核。</p></div>'
      '<div class="promise-grid"><div class="promise"><div class="n">2 小时</div><div class="u">日常需求</div><h3>到场</h3><p>以合同为准</p></div><div class="promise"><div class="n">24 小时</div><div class="u">应急需求</div><h3>电话在线</h3><p>即刻响应 · 以合同为准</p></div></div>'
      + belt("七层服务 · 一地一管家","每一层，写明交付内容与频率") + svc_rows +
      '<p style="font-size:var(--fs-xs);color:var(--text-soft);font-weight:300;margin-top:.4rem;">服务项与交付标准以最终合同为准，逐项可勾选、可验收。</p>'
      + belt("管家来自本地社区","实名 · 培训记录 · 年度考核均可出示") +
      '<div class="words-grid" style="grid-template-columns:repeat(4,1fr);"><div class="word-cell"><h3 style="font-size:1.08rem;">大理 · 阿嬢</h3><p style="font-size:var(--fs-xs);">海西村落长大，认得每一家早点摊。</p></div><div class="word-cell"><h3 style="font-size:1.08rem;">丽江 · 小和</h3><p style="font-size:var(--fs-xs);">纳西族，古城里长大的本地人。</p></div><div class="word-cell"><h3 style="font-size:1.08rem;">迪庆 · 卓玛</h3><p style="font-size:var(--fs-xs);">香格里拉牧场人家的女儿。</p></div><div class="word-cell"><h3 style="font-size:1.08rem;">怒江 · 阿普</h3><p style="font-size:var(--fs-xs);">丙中洛峡谷里的傈僳族。</p></div></div>'
      '<p style="font-size:var(--fs-xs);color:var(--text-soft);font-weight:300;margin-top:.7rem;">管家实名与照片将在上线前公示；当前展示为岗位画像，培训记录与年度考核可向客户出示。</p>'
      + belt("医疗边界 · 书面负面清单","把边界写清楚，是对您负责") +
      '<div class="guards"><ul>' + "".join(f'<li>{check_icon("earthen")}{g}</li>' for g in [
        "管家不做任何问诊、给药、治疗或医疗建议（依法，医疗行为需执业资格）。","就医陪诊只负责陪同、预约、取药与传达，诊疗决策一律由医生作出。","管家不参与任何购物返佣、回扣（写入合同）。","涉及您的健康等敏感信息，仅用于保障服务，单独征求同意后使用。"]) +
      '<p class="guard-note">一句话边界：就医陪诊只负责陪同、预约、取药与传达，诊疗决策一律由执业医师作出——依法，医疗行为需执业资格。</p></ul></div></div></section>')

def main_living(base):
    return (
      '<section class="section"><div class="wrap"><div class="section-head"><p class="eyebrow">生活方式 · REVIVE / SETTLE / WORK</p><h2 class="h2">换一种过法，<em>住进日子</em></h2><p class="lede">同样在云南住进日子，换一种过法：给日子透口气、退休安顿下来、或以工换住边养边做。</p></div>'
      f'<article class="live-block"><div class="media">{img(base+"assets/img/"+IMG["pagoda"], "丽江古城雪后的白塔与屋顶")}</div><div class="body"><span class="kicker">REVIVE · 焕新居</span><h3>给自己的日子，透一口气</h3><p class="en">1 – 3 个月 · 数字游民 · 间隔年 · 创作者</p>'
      '<p>生活卡在同一条轨道上太久了——固定的班、固定的街、固定的自己。焕新居是给自己的生活开一扇透气窗：来到云南，住进一间安顿好的院子，网络稳定、社群在侧，日子从菜市场和晨光开始。不用辞职，也能换一口气。</p>'
      '<div class="live-meta"><div class="m"><div class="k">居住时长</div><div class="v">1 – 3 个月</div></div><div class="m"><div class="k">排期</div><div class="v">弹性</div></div><div class="m"><div class="k">邻里</div><div class="v">轻邻里</div></div><div class="m"><div class="k">网络与工位</div><div class="v">已备好</div></div></div>'
      f'<a class="btn btn--earthen btn--sm" href="{base}contact.html" data-nav>聊聊想换的活法</a></div></article>'
      f'<article class="live-block"><div class="media">{img(base+"assets/img/"+IMG["terraces"], "元阳哈尼梯田的晨雾与水面")}</div><div class="body"><span class="kicker">SETTLE · 安居</span><h3>退休了，换个暖和、干净的地方住</h3><p class="en">15 天 – 数年 · 16 州自由组合</p>'
      '<p>退休不是生活的结束，是终于可以把日子安排得舒服点。家乡冬天太冷、空气欠佳、一个人在家没着落？来云南，把日子搬进春天里。选中一处，安顿下来——不赶路、不搬来搬去，住多久自己说了算。邻里替你接住买菜做饭、看病取药，家属安心群让儿女每天看得见。</p>'
      '<div class="live-meta"><div class="m"><div class="k">养老小院</div><div class="v">3 间<small>1 自住 · 2 待客</small></div></div><div class="m"><div class="k">试点地州</div><div class="v">多地<small>版纳·普洱·临沧·保山·红河</small></div></div><div class="m"><div class="k">院落</div><div class="v">可租可买<small>现成院子收拾就能住</small></div></div><div class="m"><div class="k">配套</div><div class="v">每周监测<small>乡镇卫生院血压血糖 · 超市配送</small></div></div></div>'
      f'<a class="btn btn--ink btn--sm" href="{base}contact.html" data-nav>聊聊长辈的云南日子</a></div></article>'
      f'<article class="live-block"><div class="media">{img(base+"assets/img/"+IMG["cormorants"], "洱海湖滨的鸬鹚与水面")}</div><div class="body"><span class="kicker">WORK · 旅居工作 · 康养工作网络</span><h3>想康养，却还没有工作？</h3><p class="en">以工换住 · 以工换三餐 · 以工换康养</p>'
      '<p>想来云南康养长住、却还没有稳定收入的，云暖用全云南的康养点位串成一张网——让你入手一份力所能及的事（照护协助 / 运营服务 / 管家助理），以工作换来住、三餐和康养，边做，边把自己养回来。具体岗位与换住方式，由管家按你的情况、所在点位和季节安排。</p>'
      '<div class="stats"><div class="stat"><div class="n">89</div><div class="l">家合作康养点位</div></div><div class="stat"><div class="n">21</div><div class="l">个覆盖地区</div></div><div class="stat"><div class="n">三餐</div><div class="l">全包 · 4/6/8 菜</div></div><div class="stat"><div class="n">1388m</div><div class="l">弥勒东风韵海拔</div></div></div>'
      f'<a class="btn btn--earthen btn--sm" href="{base}contact.html" data-nav>入手一份康养事</a></div></article></div></section>')

def main_food(base):
    cards = "".join(f'<article class="food-card"><div class="top"><div class="name"><span class="cn">{s["cn"]}</span><span class="en">{s["en"]}</span></div><p class="intro">{s["foodIntro"]}</p></div><div class="grid">'
      f'<div class="cell"><div class="k">代表菜</div><div class="v">{s["food"]["dish"]}</div></div>'
      f'<div class="cell"><div class="k">早点</div><div class="v">{s["food"]["bf"]}</div></div>'
      f'<div class="cell"><div class="k">时鲜</div><div class="v">{s["food"]["season"]}</div></div>'
      f'<div class="cell"><div class="k">一杯</div><div class="v">{s["food"]["drink"]}</div></div>'
      f'<div class="cell"><div class="k">街头</div><div class="v">{s["food"]["street"]}</div></div></div></article>' for s in STATES)
    return (
      f'<section class="hero" style="min-height:50vh;"><div class="hero-media-wrap">{img(base+"assets/img/"+IMG["food"], "云南美食桌面的暖色食物", cls="hero-media")}</div><div class="hero-scrim" aria-hidden="true"></div>'
      '<div class="hero-content wrap">'+hero_kicker("云南美食 · 16 州味觉版图")+'<h1 class="hero-title"><span class="hl">住进日子的味道</span></h1><p class="hero-sub">从一顿早点开始，到一顿宵夜结束。</p><p class="hero-foot">十六个州市，各有各的味觉。不标「必吃」，只告诉你——住进一个地方，可以吃到什么。</p></div></section>'
      + mountain_divider() +
      '<section class="section"><div class="wrap"><div class="section-head"><p class="eyebrow">味觉版图 · 十六州</p><h2 class="h2">住进一个地方，<em>可以吃到什么</em></h2><p class="lede">我们把当地人家常吃的味道记下来——不是菜单，是日子本身。从一顿早点开始、到一顿宵夜结束。</p></div>'
      f'<div class="food-grid">{cards}</div></div></section>')

def main_trust(base):
    pledge_rows = "".join(f'<div class="pledge"><span class="no">{p[0]}</span><div><h3>{p[1]}</h3><p>{p[2]}</p></div></div>' for p in PLEDGES)
    insure_rows = "".join(f'<div class="insure"><div class="no">{i[0]}</div><h3>{i[1]}</h3><p>{i[2]}</p></div>' for i in INSURES)
    return (
      '<section class="section"><div class="wrap"><div class="section-head"><p class="eyebrow">信任中心 · 2012 年起</p><h2 class="h2">承诺写进合同，<em>证据公开可查</em></h2><p class="lede">我们不是靠承诺做生意，是靠写进合同与可核验的证据。</p></div>'
      + belt("服务清单与承诺，写入合同","不是一句口号，是逐条可主张的条款") + f'<div class="pledges">{pledge_rows}</div>'
      + belt("保险三件套，随合同交付","出行、居停、用人，三个环节都有保障") + f'<div class="insures">{insure_rows}</div>'
      '<p style="font-size:var(--fs-xs);color:var(--text-soft);font-weight:300;margin-top:.8rem;">保险方案与条款随合同一并交付；保额与保障范围以承保方案为准。</p>'
      + belt("医疗边界 · 书面负面清单","加粗提示 · 单独签字") +
      '<div class="guards"><ul>' + "".join(f'<li>{check_icon("earthen")}{g}</li>' for g in [
        "管家不做任何问诊、给药、治疗或医疗建议（依法，医疗行为需执业资格）。","就医陪诊只负责陪同、预约、取药与传达，诊疗决策一律由医生作出。","管家不参与任何购物返佣、回扣（写入合同）。","涉及您的健康等敏感信息，仅用于保障服务，单独征求同意后使用。"]) + '</ul></div>'
      + belt("可核验路径","每一项承诺，都有对应的证据可以查") +
      '<div class="words-grid" style="grid-template-columns:repeat(2,1fr);"><div class="word-cell"><h3 style="font-size:1.02rem;">资质证照</h3><p style="font-size:var(--fs-xs);">公司资质证照公示（统一社会信用代码 / 旅行社业务经营许可证号，上线前公示）。</p></div><div class="word-cell"><h3 style="font-size:1.02rem;">住宿证照</h3><p style="font-size:var(--fs-xs);">逐州住宿合作方证照可查（酒店 / 民宿特种行业许可证）。</p></div><div class="word-cell"><h3 style="font-size:1.02rem;">管家档案</h3><p style="font-size:var(--fs-xs);">管家实名、培训记录与年度考核可向客户出示；上岗前先考核，考核不过不上岗。</p></div><div class="word-cell"><h3 style="font-size:1.02rem;">产权合规</h3><p style="font-size:var(--fs-xs);">优先可合法交易的国有公房（村公所 / 供销社 / 粮站），不碰农村宅基地买卖；房源一律真实实拍。</p></div></div>'
      + belt("个人信息，怎么用、怎么管","仅用于定制行程与管家联系") +
      '<div class="steps" style="grid-template-columns:repeat(4,1fr);"><div class="step"><h3>告知</h3><p>用途先说明。</p></div><div class="step"><h3>同意</h3><p>取得后再使用。</p></div><div class="step"><h3>单独同意</h3><p>健康等敏感信息单独征求。</p></div><div class="step"><h3>删除</h3><p>可随时要求删除。</p></div></div></div></section>'
      + cta_band(base,"签约前，逐项过目","合同、保险、证照、管家档案——每一份方案都配合同文本，签约前逐项过目。"))

def main_contact(base):
    return (
      '<section class="section"><div class="wrap"><div class="section-head"><p class="eyebrow">联系管家 · CONTACT</p><h2 class="h2">没有标准问卷，<em>发一句「我想去云南」</em></h2><p class="lede">我们认真听你说。谁住、住多久、在意什么——聊清楚再出方案与合同。</p></div><div class="contacts">'
      '<article class="contact-card"><span class="who">云南在地 15 年</span><h3>王先生</h3><p class="bio">在云南住了十五年，我把每座城都走成了熟人——翠湖边哪棵树下风最轻，沙溪哪家的豆花最好。我带你去的，从来不是景点，是这片土地本来就在过的日子。</p><div class="tel-line"><span class="num">132 0888 8618</span><a class="btn btn--earthen btn--sm" href="tel:13208888618">一键拨打</a></div></article>'
      '<article class="contact-card"><span class="who">旅欧高定 11 年 · 云南高定 6 年</span><h3>白先生</h3><p class="bio">在罗马定居的十一年里，我陪过许多人走近那座永恒之城——知道哪扇门后藏着最好的画室，哪家小馆会为常客留一扇靠窗的位置。回到云南的六年，我把那套不慌不忙的分寸，带回了高原。</p><div class="tel-line"><span class="num">177 8728 8800</span><a class="btn btn--earthen btn--sm" href="tel:17787288800">一键拨打</a></div></article></div>'
      '<form class="form" id="contact-form"><div class="form-row"><div class="field"><label for="f-name">称呼 <span class="req">*</span></label><input id="f-name" name="name" type="text" required maxlength="30" placeholder="怎么称呼您"></div><div class="field"><label for="f-contact">联系方式（电话 / 微信）<span class="req">*</span></label><input id="f-contact" name="contact" type="text" required maxlength="40" placeholder="手机号或微信号"></div></div>'
      '<div class="form-row"><div class="field"><label for="f-kind">意向住法</label><select id="f-kind" name="kind"><option value="">请选择（可留空）</option><option>亲老家庭</option><option>活力银发</option><option>长住</option><option>焕新居 · 数字游民 / 间隔年</option><option>旅居工作 · 康养以工换住</option></select></div><div class="field"><label for="f-count">出行人数</label><input id="f-count" name="count" type="text" maxlength="20" placeholder="如：2 人"></div></div>'
      '<div class="form-row"><div class="field"><label for="f-date">意向出行日期</label><input id="f-date" name="date" type="text" maxlength="30" placeholder="如：2026 年 11 月"></div><div class="field"><label for="f-need">特殊需求</label><input id="f-need" name="need" type="text" maxlength="60" placeholder="如：需要无障碍、慢病提醒等"></div></div>'
      '<div class="field"><label for="f-more">想过的日子（选填）</label><textarea id="f-more" name="more" maxlength="400" placeholder="说说谁住、住多久、在意什么——比如「想给爸妈安排一段云南日子」"></textarea></div>'
      '<button class="btn btn--earthen" type="submit">提交给管家</button>'
      '<p class="form-note">信息仅用于定制行程与管家联系，不会对外披露或用于营销推送。提交后管家会在 10 分钟内联系您。提交即表示同意<a href="privacy.html" data-nav>隐私政策</a>。</p>'
      '<div class="form-sent" id="form-sent" role="status">已收到您的留言，管家会在 10 分钟内与您联系。也可以直接拨打：王先生 132 0888 8618 / 白先生 177 8728 8800。</div></form>'
      + belt("从一个电话，到一段日子","六步之后，拿到的不是行程表，是安顿下来的生活") +
      '<div class="steps" style="grid-template-columns:repeat(3,1fr);"><div class="step"><h3>一对一需求访谈</h3><p>聊清是谁住、住多久、在意什么。</p></div><div class="step"><h3>定制生活方案</h3><p>板块、站点节奏、管家匹配。</p></div><div class="step"><h3>方案沟通</h3><p>把「一天怎么过」逐日聊透。</p></div><div class="step"><h3>合同与保险确认</h3><p>服务清单与承诺写入合同。</p></div><div class="step"><h3>出发前建群</h3><p>管家、云管家与家人都在。</p></div><div class="step"><h3>入住后管家相伴</h3><p>安顿日接入，家属安心群。</p></div></div></div></section>')

# ---------- 新增页面 ----------
def main_stories(base):
    nums = ["壹","贰","叁"]
    story_cards = ""
    for i,(title,who,scene,handled,tags) in enumerate(STORIES,0):
        story_cards += (f'<article class="story"><div class="story-head"><span class="no">{nums[i]}</span>'
          f'<div><h3>{title}</h3><p class="who">{who}</p></div></div><div class="story-body">'
          f'<div class="scene"><h4>他们从哪里来</h4><p>{scene}</p></div>'
          f'<div class="handled"><h4>日子怎么被接住</h4><p>{handled}</p></div>'
          f'<div class="tags">{tags}</div></div></article>')
    return (
      '<section class="section"><div class="wrap"><div class="section-head"><p class="eyebrow">旅居故事 · STORIES</p><h2 class="h2">被接住的日子，<em>最常有三种来法</em></h2>'
      '<p class="lede">异地子女给爸妈安排、上班族想透口气、退休后的第一个春天——这些是过去十多年里最常见的三种来法。我们把典型旅程梳理出来，帮你对号入座。</p>'
      '<p class="note" style="font-size:var(--fs-xs);color:var(--text-soft);font-weight:300;margin-top:.6rem;">说明：以下为典型客群旅程的梳理与示意，不指向任何具体个人，涉及细节均已隐去；真实个案以签约沟通与合同为准。</p></div>'
      f'<div class="story-grid">{story_cards}</div></div></section>' + cta_band(base,"你属于哪一种？","无论哪种，先发一句「我想去云南」，我们把日子聊清楚。"))

def faq_jsonld():
    return ('<script type="application/ld+json">'+json.dumps({
        "@context":"https://schema.org","@type":"FAQPage","mainEntity":[
          {"@type":"Question","name":q,"acceptedAnswer":{"@type":"Answer","text":a}} for q,a in FAQ]}, ensure_ascii=False)+'</script>')
def main_faq(base):
    items = "".join(f'<div class="faq-item"><h3><button type="button" aria-expanded="false">{q}</button></h3><div class="faq-a"><p>{a}</p></div></div>' for q,a in FAQ)
    return (
      '<section class="section"><div class="wrap"><div class="section-head"><p class="eyebrow">常见问题 · FAQ</p><h2 class="h2">签约前，<em>先把想问的问了</em></h2><p class="lede">收费、时长、接站、就医、转场、宠物、付款与退改——被问得最多的 10 个问题，先给你答案。没找到的，直接问管家。</p></div>'
      f'<div class="faq-list">{items}</div>'
      + belt("还有没答上的？","直接说，10 分钟内回复") +
      '<div class="contacts" style="grid-template-columns:1fr 1fr;"><article class="contact-card"><span class="who">云南在地 15 年</span><h3>王先生</h3><div class="tel-line"><span class="num">132 0888 8618</span><a class="btn btn--earthen btn--sm" href="tel:13208888618">一键拨打</a></div></article>'
      '<article class="contact-card"><span class="who">旅欧高定 11 年 · 云南高定 6 年</span><h3>白先生</h3><div class="tel-line"><span class="num">177 8728 8800</span><a class="btn btn--earthen btn--sm" href="tel:17787288800">一键拨打</a></div></article></div>'
      '</div></section>')

def main_privacy(base):
    return (
      '<section class="section"><div class="wrap"><div class="section-head"><p class="eyebrow">隐私政策 · PRIVACY</p><h2 class="h2">你的信息，<em>怎么用、怎么管</em></h2><p class="lede">生效日期：2026 年 10 月 · 更新日期：2026 年 10 月。我们只收集定制行程与管家联系所需的信息。</p></div>'
      '<div class="legal-block"><h3>一、我们收集哪些信息</h3><p>当您通过联系表单或意向表单提交时，我们收集您主动填写的：称呼、联系方式（电话 / 微信）、意向住法、出行人数、意向出行日期、特殊需求，以及您留言中提到的内容。</p>'
      '<h3>二、我们如何使用</h3><p>这些信息仅用于：为您定制旅居方案、安排管家联系、落实您提出的特殊需求。我们不会用于营销推送，不会出售或出租您的信息。</p>'
      '<h3>三、健康等敏感信息</h3><p>您若在留言中提供健康状况等敏感信息，我们将单独征求您的同意后使用，仅用于保障相关服务（如就医陪诊、慢病提醒），并采取相应保护措施。管家不做任何诊疗建议。</p>'
      '<h3>四、信息保存与安全</h3><p>我们采用合理的技术与管理措施保护您的信息。合同服务关系结束后，我们会按您的要求或在合理期限内删除与您相关的信息，除非法律另有规定。</p>'
      '<h3>五、您的权利</h3><p>您有权查询、更正、复制、删除您的个人信息，或撤回同意。行使权利或对隐私有疑问，请联系：王先生 132 0888 8618。</p>'
      '<h3>六、联系我们</h3><p>隐私政策相关问题，可拨打 132 0888 8618（王先生）或 177 8728 8800（白先生）。</p>'
      '<p class="legal-note">本页为便于线上预览而撰写的说明性文本，正式隐私政策以您与云暖旅居签署的协议文本为准。</p></div></div></section>')

def main_terms(base):
    return (
      '<section class="section"><div class="wrap"><div class="section-head"><p class="eyebrow">服务条款 · TERMS</p><h2 class="h2">先说清楚，<em>再签约</em></h2><p class="lede">本页概括云暖・旅居的服务边界与基本约定；具体权利义务以双方签署的服务清单制合同为准。</p></div>'
      '<div class="legal-block"><h3>一、服务性质</h3><p>云暖・旅居提供旅居（长住）生活服务，包括住宿安顿、生活管家、就医陪诊（仅陪同与协调）、出行调度、社交活动等，服务项与交付标准逐项写入合同。</p>'
      '<h3>二、医疗边界</h3><p>管家不做任何问诊、给药、治疗或医疗建议；就医陪诊只负责陪同、预约、取药与传达，诊疗决策一律由执业医师作出。健康相关信息仅用于保障服务，单独征求同意后使用。</p>'
      '<h3>三、费用与支付</h3><p>总价包含合同所列全部服务项目及税费，除明示自选项目外不另行收取任何费用；付款方式、退改条款以合同约定为准。</p>'
      '<h3>四、责任与承诺</h3><p>服务清单与承诺（不安排购物、无另行付费、管家零回扣、违约可主张）写入合同；违反承诺的，按合同与相关法律处理。</p>'
      '<h3>五、合同优先</h3><p>本页为概括性说明，不构成合同的全部内容。具体服务范围、费用、保险、退改与争议解决，一律以您与云暖旅居签署的正式合同为准。</p>'
      '<p class="legal-note">本页为便于线上预览而撰写的说明性文本，正式服务条款以签署的合同文本为准。</p></div></div></section>')

def main_404(base):
    return (
      '<section class="section section--mist" style="min-height:60vh;display:flex;align-items:center;"><div class="wrap" style="max-width:640px;">'
      '<p class="eyebrow">404 · 走岔了路</p><h2 class="h2">这片山谷，<em>暂时没人住</em></h2>'
      '<p class="lede" style="margin-bottom:1.6rem;">你访问的页面不存在或已移动。别急，云南还有很多地方可以住。</p>'
      f'<div style="display:flex;gap:.8rem;flex-wrap:wrap;"><a class="btn btn--earthen" href="{base}index.html" data-nav>回到首页</a>'
      f'<a class="btn btn--ink" href="{base}destination.html" data-nav>去 16 州版图</a>'
      f'<a class="btn btn--ink" href="{base}contact.html" data-nav>联系管家</a></div></div></section>')

# ---------- 写文件 ----------
PAGES = {
  "index.html": ("首页","云暖・旅居 · 在云南，住进日子｜旅居体验包 · 16 州自选 · 旅居总管","云暖・旅居——2012 年起的云南旅居（长住）品牌。不是来看云南，是住进云南的日子。旅居体验包一地一周起、16 州自由组合，一地一旅居总管。","/index.html"),
  "destination.html": ("目的地","目的地 · 16 州生活版图｜云暖・旅居","云南 16 州，七片区域。气候、穿衣、味道，先看清楚，再选择一处，安顿下来。","/destination.html"),
  "experience.html": ("体验包","旅居体验包 · 一地一周起 · 自由组合｜云暖・旅居","精品居 / 日常居两档，16 州自由组合、三种节奏、私人定制。","/experience.html"),
  "concierge.html": ("旅居总管","旅居总管 · 一地一管家｜云暖・旅居","一地一旅居总管：买菜、就医陪诊、水电报修、应急响应。日常 2 小时到场，应急 24 小时在线。七层服务写入合同。","/concierge.html"),
  "living.html": ("生活方式","焕新居 · 安居 · 旅居工作｜云暖・旅居","换一种过法，住进日子：焕新居透口气、安居安顿下来、以工换住边养边做。","/living.html"),
  "food.html": ("美食","云南美食 · 16 州味觉版图｜云暖・旅居","16 州味觉版图：代表菜、早点、时鲜、一杯、街头——住进一个地方，可以吃到什么。","/food.html"),
  "trust.html": ("信任","信任中心 · 服务清单与医疗边界｜云暖・旅居","承诺写进合同，证据公开可查：服务清单制合同、保险三件套、医疗边界、可核验路径。","/trust.html"),
  "contact.html": ("联系","联系管家 · 云南旅居咨询｜云暖・旅居","没有标准问卷，发一句「我想去云南」。两位在地管家，六步定制流程。","/contact.html"),
  "stories.html": ("--","旅居故事 · 被接住的日子｜云暖・旅居","异地子女给爸妈安排、上班族透口气、退休后的春天——三种最常见的来法。","/stories.html"),
  "faq.html": ("--","常见问题 · 签约前先问｜云暖・旅居","收费、时长、接站、就医、转场、宠物、付款与退改——被问最多的 10 个问题。","/faq.html"),
  "privacy.html": ("--","隐私政策｜云暖・旅居","你的信息怎么用、怎么管。仅用于定制行程与管家联系。","/privacy.html"),
  "terms.html": ("--","服务条款｜云暖・旅居","服务性质、医疗边界、费用与承诺——以正式合同为准。","/terms.html"),
  "404.html": ("--","404 · 页面不存在｜云暖・旅居","你要找的页面不存在，回首页继续逛。","/404.html"),
}
MAINS = {
  "index.html": lambda b: main_home(b), "destination.html": lambda b: main_destination(b),
  "experience.html": lambda b: main_experience(b), "concierge.html": lambda b: main_concierge(b),
  "living.html": lambda b: main_living(b), "food.html": lambda b: main_food(b),
  "trust.html": lambda b: main_trust(b), "contact.html": lambda b: main_contact(b),
  "stories.html": lambda b: main_stories(b), "faq.html": lambda b: main_faq(b),
  "privacy.html": lambda b: main_privacy(b), "terms.html": lambda b: main_terms(b),
  "404.html": lambda b: main_404(b),
}
for fname,(active,title,desc,canon) in PAGES.items():
    extra = faq_jsonld() if fname=="faq.html" else ""
    html = page_doc("./", title, desc, active, canon, MAINS[fname]("./"), extra)
    with open(os.path.join(ROOT, fname), "w", encoding="utf-8") as f: f.write(html)
    print("生成", fname)

for s in STATES:
    sid=s["id"]; cn=s["cn"]; r=region_of(sid)
    title = f"{cn} · {s['desc']}｜云暖・旅居"
    desc = f"{cn}，{s['desc']}。{s['foodIntro']} 何时去、怎么吃、谁接住日子，一次说清。"
    html = page_doc("../", title, desc, "目的地", "/places/"+sid+".html", main_place("../", sid), place_jsonld(s, r))
    with open(os.path.join(ROOT, "places", f"{sid}.html"), "w", encoding="utf-8") as f: f.write(html)
    print("生成 places/"+sid+".html")

# ---------- sitemap / robots ----------
urls = [DOMAIN+"/"] + [DOMAIN+"/"+f for f,_ in PAGES.items() if f!="404.html"] + [DOMAIN+"/places/"+s["id"]+".html" for s in STATES]
sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + \
  "".join(f'  <url><loc>{u}</loc></url>\n' for u in urls) + '</urlset>\n'
open(os.path.join(ROOT,"sitemap.xml"),"w",encoding="utf-8").write(sitemap)
robots = ("User-agent: *\nAllow: /\nDisallow: /places/qujing.html\n\n"
          f"Sitemap: {DOMAIN}/sitemap.xml\n")
open(os.path.join(ROOT,"robots.txt"),"w",encoding="utf-8").write(robots)
print("生成 sitemap.xml（", len(urls), "url）与 robots.txt")
print("全部完成，共", len(PAGES)+len(STATES), "个 HTML 页面")
