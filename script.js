const vocabulary = {
    themes: {
        spring: {
            nouns: ['春风', '春雨', '桃花', '杏花', '梨花', '杨柳', '燕子', '黄莺', '蝴蝶', '蜜蜂', '芳草', '新绿', '嫩芽', '清溪', '浅滩', '小桥', '人家', '田园', '桑麻', '麦浪', '菜花', '梨花', '海棠', '牡丹', '芍药', '丁香', '蔷薇', '紫藤', '兰草', '蕙风', '韶光', '韶华', '青春', '芳辰', '佳期', '良辰', '美景', '艳阳', '晨光', '晓露', '朝露', '晨雾', '晓烟', '春潮', '春水', '春江', '春山', '春野', '春郊', '春园', '春庭', '春榭', '春台'],
            verbs: ['吹', '拂', '润', '滋', '绽', '开', '吐', '萌', '发', '抽', '展', '舞', '飞', '鸣', '啼', '唱', '吟', '游', '逛', '赏', '探', '寻', '觅', '折', '采', '撷', '拈', '嗅', '闻', '听', '观', '望', '看', '眺', '盼', '思', '忆', '念', '想', '怜', '惜', '爱', '恋', '依', '偎', '携', '挽', '牵', '拉'],
            adjectives: ['暖', '和', '柔', '软', '轻', '细', '新', '鲜', '嫩', '翠', '青', '绿', '红', '艳', '香', '甜', '美', '好', '佳', '妙', '奇', '清', '幽', '明', '亮', '丽', '秀', '雅', '娴', '静', '恬', '安', '宁', '和', '煦', '温', '润', '湿', '潮', '浓', '淡', '深', '浅', '远', '近']
        },
        summer: {
            nouns: ['夏日', '夏阳', '暑气', '炎光', '烈日', '骄阳', '火云', '晴空', '蓝天', '白云', '荷风', '荷香', '荷花', '莲叶', '莲蓬', '藕花', '菱角', '蒲草', '芦苇', '蛙声', '蝉鸣', '萤火', '流萤', '星光', '银河', '新月', '晚风', '凉夜', '竹影', '蕉叶', '梧桐', '桑阴', '柳荫', '槐荫', '瓜棚', '豆架', '菜园', '水井', '山泉', '溪流', '池塘', '湖泊', '江河', '湖海', '渔舟', '渔船', '归帆', '远帆'],
            verbs: ['照', '晒', '烤', '灼', '燃', '烧', '辉', '映', '耀', '闪', '烁', '开', '放', '绽', '吐', '香', '飘', '散', '飞', '舞', '鸣', '叫', '啼', '唱', '吟', '跃', '跳', '游', '泳', '戏', '玩', '赏', '观', '看', '望', '听', '闻', '嗅', '尝', '饮', '喝', '食', '品', '享', '受', '思', '忆', '念', '想'],
            adjectives: ['热', '炎', '暑', '酷', '烈', '强', '盛', '浓', '密', '厚', '深', '重', '高', '大', '明', '亮', '清', '凉', '爽', '快', '轻', '柔', '软', '嫩', '鲜', '美', '佳', '妙', '奇', '异', '新', '旧', '古', '老', '远', '近', '长', '短', '宽', '窄', '阔', '狭']
        },
        autumn: {
            nouns: ['秋风', '秋雨', '秋霜', '秋露', '秋月', '秋星', '秋阳', '秋光', '秋色', '秋景', '秋意', '秋情', '秋心', '秋愁', '秋思', '秋忆', '秋念', '秋山', '秋水', '秋江', '秋湖', '秋池', '秋潭', '秋溪', '秋涧', '秋林', '秋树', '秋叶', '秋枫', '秋桂', '秋菊', '秋兰', '秋荷', '秋苇', '秋芦', '秋草', '秋虫', '秋雁', '秋鸿', '秋燕', '秋蝉', '秋蛩', '秋声', '秋籁', '秋云', '秋雾', '秋烟', '秋霞', '秋虹', '秋阳'],
            verbs: ['吹', '扫', '落', '飘', '飞', '舞', '摇', '荡', '晃', '动', '响', '鸣', '叫', '啼', '唱', '吟', '叹', '息', '泣', '哭', '笑', '欢', '悲', '愁', '恨', '思', '念', '想', '忆', '记', '忘', '望', '看', '观', '赏', '听', '闻', '嗅', '尝', '触', '抚', '摸', '携', '持', '把', '握', '提', '拎', '挑', '担'],
            adjectives: ['凉', '冷', '寒', '清', '寂', '寥', '旷', '远', '深', '高', '淡', '雅', '素', '净', '洁', '白', '黄', '红', '丹', '朱', '赤', '橙', '金', '银', '灰', '暗', '明', '亮', '丽', '美', '佳', '妙', '奇', '古', '老', '新', '旧', '多', '少', '浓', '淡', '轻', '重']
        },
        winter: {
            nouns: ['冬风', '冬雪', '冬梅', '冬松', '冬柏', '冬青', '冬竹', '冬兰', '冬菊', '冰霜', '冰雪', '冰凌', '冰柱', '冰花', '雪花', '雪片', '雪絮', '雪粒', '雪珠', '雪人', '雪山', '雪地', '雪原', '雪野', '雪林', '雪树', '雪枝', '雪芽', '寒江', '寒河', '寒湖', '寒池', '寒潭', '寒溪', '寒涧', '寒山', '寒谷', '寒林', '寒树', '寒枝', '寒鸦', '寒鸟', '寒雁', '寒鸿', '寒蝉', '寒蛩', '寒星', '寒月', '寒阳', '寒光'],
            verbs: ['吹', '刮', '呼啸', '飘', '飞', '落', '降', '洒', '撒', '堆', '积', '盖', '覆', '压', '垂', '挂', '悬', '凝', '结', '冻', '冰', '封', '锁', '闭', '关', '开', '放', '绽', '吐', '香', '散', '飘', '飞', '舞', '鸣', '叫', '啼', '唱', '吟', '叹', '思', '念', '想', '忆', '记', '忘', '望', '看', '观', '赏'],
            adjectives: ['寒', '冷', '凉', '冰', '冻', '雪', '霜', '白', '素', '洁', '净', '清', '幽', '寂', '寥', '静', '宁', '安', '和', '严', '酷', '烈', '猛', '强', '盛', '浓', '密', '厚', '深', '高', '远', '近', '低', '矮', '小', '大', '新', '旧', '古', '老']
        },
        landscape: {
            nouns: ['青山', '绿水', '山川', '江河', '湖海', '溪涧', '瀑布', '泉眼', '池塘', '湖泊', '江海', '山岳', '峰峦', '岭岫', '崖壁', '岩壑', '洞穴', '石窟', '石林', '石壁', '石桥', '石径', '石阶', '石梯', '土路', '泥路', '沙路', '水路', '云路', '天路', '山路', '水路', '林路', '田路', '村路', '乡路', '古道', '驿道', '栈道', '索道', '虹桥', '板桥', '木桥', '竹桥', '石桥'],
            verbs: ['环', '绕', '抱', '拥', '围', '绕', '环', '抱', '流', '淌', '奔', '驰', '走', '行', '游', '逛', '登', '攀', '爬', '上', '下', '过', '穿', '越', '跨', '渡', '涉', '趟', '踏', '踩', '走', '行', '立', '站', '坐', '卧', '躺', '倚', '靠', '依', '偎', '凭', '临', '望', '看', '观', '赏', '听'],
            adjectives: ['青', '绿', '苍', '翠', '碧', '蓝', '红', '丹', '朱', '赤', '黄', '金', '白', '素', '黑', '玄', '灰', '暗', '明', '亮', '清', '幽', '深', '浅', '远', '近', '高', '低', '大', '小', '长', '短', '宽', '窄', '阔', '狭', '险', '峻', '陡', '峭', '平', '缓', '曲', '直']
        },
        pastoral: {
            nouns: ['田园', '村野', '乡村', '农家', '农舍', '茅屋', '草屋', '瓦屋', '瓦房', '土房', '木房', '竹楼', '阁楼', '亭台', '楼阁', '轩榭', '庭院', '柴门', '篱笆', '院墙', '园圃', '菜园', '果园', '花园', '茶园', '桑园', '麻园', '麦田', '稻田', '棉田', '豆田', '瓜田', '菜地', '粮田', '耕地', '田地', '土地', '田野', '原野', '草原', '草地', '牧场', '林场', '渔场', '荷塘', '鱼池', '虾塘', '蟹塘', '鸭场', '鸡场'],
            verbs: ['耕', '种', '植', '栽', '插', '播', '撒', '施', '浇', '灌', '溉', '锄', '铲', '耙', '犁', '耘', '耨', '收', '割', '获', '打', '晒', '晾', '储', '藏', '养', '喂', '饲', '牧', '放', '赶', '追', '捕', '捉', '钓', '网', '捞', '采', '摘', '收', '拾', '捡', '寻', '觅', '找', '看', '望', '观', '赏'],
            adjectives: ['安', '宁', '静', '谧', '幽', '闲', '适', '逸', '悠', '然', '自', '在', '自', '由', '快', '乐', '欢', '喜', '美', '好', '佳', '妙', '新', '鲜', '清', '香', '甜', '美', '朴', '实', '质', '朴', '淳', '厚', '憨', '厚', '善', '良', '和', '睦', '亲', '切', '友', '善']
        },
        windMoon: {
            nouns: ['清风', '明月', '朗月', '皓月', '新月', '残月', '满月', '圆月', '缺月', '弯月', '眉月', '月牙', '月光', '月色', '月影', '月魄', '月魂', '月轮', '月华', '月桂', '月兔', '月蟾', '月娥', '月姊', '月妹', '月兄', '月弟', '月父', '月母', '风月', '风花', '雪月', '烟花', '烟云', '烟霞', '烟雾', '云雾', '云霞', '霞光', '霞彩', '彩虹', '长虹', '彩云', '青云', '白云', '蓝天', '碧空', '苍穹', '天宇', '天空', '天际', '天涯', '海角'],
            verbs: ['吹', '拂', '掠', '扫', '过', '穿', '透', '渗', '浸', '润', '照', '映', '耀', '辉', '洒', '倾', '泻', '流', '淌', '飘', '飞', '舞', '荡', '摇', '晃', '动', '转', '旋', '回', '归', '来', '去', '往', '返', '回', '还', '留', '停', '驻', '立', '站', '坐', '卧', '躺', '倚', '靠', '依', '偎'],
            adjectives: ['清', '幽', '淡', '雅', '素', '洁', '白', '明', '亮', '圆', '满', '缺', '残', '新', '旧', '古', '老', '远', '近', '高', '低', '深', '浅', '浓', '淡', '轻', '重', '柔', '软', '细', '密', '疏', '稀', '多', '少', '大', '小', '长', '短', '宽', '窄', '阔', '狭']
        },
        farewell: {
            nouns: ['长亭', '短亭', '驿站', '客舍', '酒家', '酒楼', '茶馆', '茶坊', '渡口', '码头', '港口', '江岸', '河畔', '湖边', '海边', '桥头', '路口', '岔路', '歧路', '歧途', '阳关', '古道', '驿路', '征程', '旅途', '归程', '归途', '去路', '来路', '别路', '离路', '思路', '忆路', '念路', '想路', '愁路', '恨路', '爱路', '情路', '心路', '魂路', '梦路', '归路', '去路', '来路', '别路', '离路', '思路', '忆路', '念路', '想路'],
            verbs: ['送', '别', '离', '去', '往', '辞', '别', '告', '辞', '辞行', '远行', '启程', '动身', '出发', '上路', '登程', '就道', '起程', '动身', '出发', '启程', '远行', '辞行', '告别', '辞别', '离别', '分离', '分别', '分手', '分袂', '分襟', '分袂', '分离', '分别', '分手', '告别', '辞别', '辞行', '远行', '启程', '动身', '出发', '上路', '登程', '就道', '起程', '动身', '出发'],
            adjectives: ['难', '舍', '难', '分', '依', '依', '恋', '恋', '不', '忍', '不', '肯', '不', '愿', '不', '想', '不', '要', '不', '肯', '不', '忍', '不', '舍', '依', '依', '恋', '恋', '难', '分', '难', '舍', '凄', '凉', '悲', '伤', '痛', '苦', '哀', '愁', '闷', '烦', '恼', '怒', '愤', '恨', '怨', '思', '念', '想', '忆', '记', '忘']
        },
        lyric: {
            nouns: ['心', '魂', '魄', '灵', '神', '思', '念', '想', '忆', '记', '情', '意', '爱', '恨', '愁', '怨', '悲', '欢', '喜', '怒', '哀', '乐', '忧', '患', '愁', '闷', '烦', '恼', '怒', '愤', '恨', '怨', '思', '念', '想', '忆', '记', '情', '意', '爱', '恨', '愁', '怨', '悲', '欢', '喜', '怒', '哀', '乐', '忧', '患', '愁', '闷', '烦', '恼'],
            verbs: ['思', '念', '想', '忆', '记', '忘', '愁', '恨', '爱', '喜', '乐', '悲', '欢', '笑', '哭', '醉', '醒', '梦', '觉', '闻', '听', '嗅', '尝', '触', '抚', '摸', '携', '持', '把', '握', '提', '拎', '挑', '担', '扛', '背', '抱', '拥', '搂', '牵', '拉', '推', '拽', '拖', '扯', '拔', '采', '摘', '折', '剪'],
            adjectives: ['真', '诚', '挚', '热', '烈', '深', '厚', '浓', '密', '亲', '切', '近', '远', '疏', '离', '别', '分', '合', '聚', '散', '悲', '欢', '离', '合', '生', '死', '存', '亡', '兴', '衰', '盛', '败', '成', '败', '得', '失', '荣', '辱', '贵', '贱', '富', '贫', '祸', '福', '吉', '凶', '善', '恶']
        }
    },
    collocations: [
        '春风拂面', '秋月照人', '青山绿水', '白云悠悠', '梅花傲雪', '竹影摇风', '松涛阵阵', '兰香满室', '菊黄蟹肥', '杨柳依依',
        '桃花流水', '杏花春雨', '梨花带雨', '荷花映日', '桂子飘香', '枫叶如丹', '梧桐夜雨', '松柏常青', '芳草萋萋', '山川壮丽',
        '江河奔腾', '湖海壮阔', '溪涧潺潺', '瀑布飞流', '泉眼无声', '池塘春草', '亭台楼阁', '轩榭流丹', '庭院深深', '柴门闻犬',
        '篱笆疏疏', '小桥流水', '渔船唱晚', '孤帆远影', '远帆点点', '归舟一叶', '燕子归来', '黄莺啼柳', '鸳鸯戏水', '蝴蝶双飞',
        '蜻蜓点水', '蝉鸣高树', '蛙声一片', '鸡声茅店', '犬吠深巷', '晨曦初露', '暮色苍茫', '朝霞灿烂', '晚霞如火', '明月皎皎',
        '繁星点点', '夕阳西下', '朝阳东升', '春雨润物', '冬雪纷飞', '秋风萧瑟', '夏日炎炎', '寒霜满地', '白露为霜', '晨露晶莹',
        '露珠滚动', '烟霞缭绕', '云雾迷蒙', '彩虹凌空', '长虹卧波', '天地悠悠', '日月如梭', '星辰灿烂', '风云变幻', '雷雨交加',
        '风霜高洁', '冰雪聪明', '山水相依', '田园风光', '故里情深', '他乡遇故', '客舍青青', '酒家旗展', '驿站梅花', '渡口人归',
        '阳关三叠', '古道西风', '长亭送别', '短亭话别', '楼台烟雨', '城门远望', '宫墙柳色', '殿宇巍峨', '庙堂高远', '山林隐逸',
        '泉石清幽', '烟萝绕屋', '薜荔满墙', '苔藓斑斑', '芦苇萧萧', '蒲草青青', '莲叶田田', '藕花深处', '菱角尖尖', '莼菜鲈鱼'
    ],
    patterns: [
        '形容词+名词+动词+名词',
        '名词+动词+形容词+名词',
        '数量词+名词+动词+形容词',
        '名词+形容词+动词+名词',
        '动词+名词+形容词+名词',
        '形容词+形容词+名词+动词',
        '名词+动词+名词+形容词',
        '形容词+名词+名词+动词',
        '动词+形容词+名词+名词',
        '数量词+形容词+名词+动词',
        '名词+动词+数量词+名词',
        '形容词+动词+名词+形容词',
        '名词+名词+动词+形容词',
        '动词+名词+数量词+名词',
        '数量词+名词+形容词+动词'
    ],
    nouns: ['春风', '秋月', '青山', '绿水', '白云', '梅花', '竹子', '松树', '兰花', '菊花', '杨柳', '桃花', '杏花', '梨花', '荷花', '桂树', '枫叶', '梧桐', '松柏', '芳草', '山川', '江河', '湖海', '溪涧', '瀑布', '泉眼', '池塘', '亭台', '楼阁', '轩榭', '庭院', '柴门', '篱笆', '小桥', '渔船', '孤帆', '远帆', '归舟', '燕子', '黄莺', '鸳鸯', '蝴蝶', '蜻蜓', '蝉鸣', '蛙声', '鸡声', '犬吠', '晨曦', '暮色', '朝霞', '晚霞', '明月', '繁星', '夕阳', '朝阳', '春雨', '冬雪', '秋风', '夏日', '寒霜', '白露', '晨露', '露珠', '烟霞', '云雾', '彩虹', '长虹', '天地', '日月', '星辰', '风云', '雷雨', '风霜', '冰雪', '山水', '田园', '故里', '他乡', '客舍', '酒家', '驿站', '渡口', '阳关', '古道', '长亭', '短亭', '楼台', '城门', '宫墙', '殿宇', '庙堂', '山林', '泉石', '烟萝', '薜荔', '苔藓', '芦苇', '蒲草', '莲叶', '藕花', '菱角', '莼菜'],
    verbs: ['吹', '照', '映', '摇', '落', '飘', '飞', '舞', '鸣', '啼', '叫', '唱', '吟', '叹', '望', '看', '观', '赏', '游', '行', '走', '来', '去', '归', '往', '迎', '送', '别', '离', '逢', '遇', '见', '思', '念', '想', '忆', '记', '忘', '愁', '恨', '爱', '喜', '乐', '悲', '欢', '笑', '哭', '醉', '醒', '梦', '觉', '闻', '听', '嗅', '尝', '触', '抚', '摸', '携', '持', '把', '握', '提', '拎', '挑', '担', '扛', '背', '抱', '拥', '搂', '牵', '拉', '推', '拽', '拖', '扯', '拔', '采', '摘', '折', '剪', '裁', '缝', '织', '绣', '绘', '画', '写', '书', '题', '留', '寄', '赠', '送', '给', '授', '传', '教', '学', '读', '诵', '念', '说', '话', '谈', '论'],
    adjectives: ['清', '幽', '深', '浅', '浓', '淡', '明', '暗', '高', '低', '远', '近', '长', '短', '新', '旧', '古', '老', '少', '多', '空', '满', '轻', '重', '微', '细', '粗', '大', '小', '真', '假', '虚', '实', '真', '美', '丑', '善', '恶', '好', '坏', '佳', '妙', '奇', '怪', '异', '同', '相似', '不同', '特别', '普通', '平凡', '伟大', '渺小', '崇高', '卑微', '高贵', '低贱', '富贵', '贫贱', '贫穷', '富有', '幸福', '痛苦', '快乐', '悲伤', '悲哀', '欢乐', '欣喜', '愤怒', '平静', '安静', '喧闹', '热闹', '冷清', '寂寞', '孤独', '孤单', '温暖', '寒冷', '凉爽', '炎热', '温和', '严厉', '严格', '宽容', '宽恕', '原谅'],
    quantity: ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '百', '千', '万', '半', '几', '数', '多', '少', '满', '全', '皆', '俱', '都', '尽', '皆', '悉', '咸', '皆', '共', '同', '相', '互', '交', '连', '接', '续', '断', '绝', '隔', '离', '分', '合', '聚', '散', '集', '散', '会', '聚', '汇', '合', '离', '别', '分', '散', '去', '来', '归', '返', '回', '还', '往', '复'],
    adverbs: ['不', '莫', '休', '勿', '岂', '怎', '奈', '何', '如', '若', '似', '像', '犹', '还', '又', '再', '也', '亦', '仍', '尚', '还', '更', '愈', '越', '甚', '颇', '稍', '略', '微', '稍', '略', '细', '详', '粗', '略', '简', '繁', '杂', '复', '单', '纯', '粹', '全', '都', '皆', '俱', '悉', '咸', '皆', '尽', '皆', '全', '俱'],
    prepositions: ['在', '于', '自', '从', '向', '往', '朝', '到', '至', '达', '抵', '临', '近', '接', '连', '接', '近', '邻', '毗', '连', '接', '和', '与', '同', '跟', '及', '并', '兼', '带', '含', '有', '无', '没', '未', '已', '曾', '尝', '曾经', '已经', '尚未', '从未', '从来', '向来', '一向', '一直', '始终', '永远', '永久', '永恒', '恒久', '长久', '长期', '短期', '暂时', '临时'],
    conjunctions: ['而', '且', '并', '与', '及', '和', '同', '跟', '以及', '乃至', '甚至', '尚且', '何况', '况且', '再者', '此外', '另外', '还有', '除此之外', '除此而外', '不仅', '不但', '不光', '不只', '不单', '不止', '不仅如此', '不但如此', '不光如此', '不只如此', '不单如此', '不止如此', '而且', '并且', '甚至', '甚至于', '甚而', '甚且', '甚或', '或是', '或者', '也许', '或许', '可能', '大概', '大约', '约莫'],
    particles: ['兮', '也', '矣', '焉', '哉', '乎', '欤', '耶', '尔', '耳', '而已', '罢了', '只', '仅', '光', '就', '才', '方', '刚', '才', '刚刚', '刚才', '方才', '正', '正在', '在', '正在', '正在', '正', '刚', '才', '方', '刚刚', '刚才', '方才', '已', '已经', '早已', '早就', '早已', '早就', '已', '已经', '早已', '早就'],
    rhymes: ['花', '家', '华', '发', '涯', '霞', '茶', '纱', '鸦', '沙', '斜', '车', '蛇', '赊', '嗟', '遮', '夸', '差', '芽', '琶', '巴', '牙', '虾', '蟆', '衙', '涯', '爷', '爹', '茄', '珈', '迦', '枷', '袈', '痂', '笳', '跏', '铊', '他', '她', '它', '遢', '趿', '拉', '啦', '喇', '邋', '旯', '砬', '揦', '垃', '拉', '旯', '砬', '揦', '垃', '拉', '旯', '砬', '揦', '垃']
};

const poemTemplates = {
    '5jue': { lines: 4, charsPerLine: 5 },
    '7jue': { lines: 4, charsPerLine: 7 },
    '5lv': { lines: 8, charsPerLine: 5 },
    '7lv': { lines: 8, charsPerLine: 7 }
};

const poemStyleTemplates = {
    '写景': {
        themes: ['spring', 'summer', 'autumn', 'winter', 'landscape', 'windMoon'],
        openings: {
            5: [[2, 1, 2], [2, 2, 1], [4, 1], [2, 1, 1, 1], [1, 2, 2]],
            7: [[2, 2, 1, 2], [4, 2, 1], [2, 1, 2, 2], [4, 1, 2], [2, 2, 2, 1], [2, 1, 4]]
        },
        closings: {
            5: [[1, 2, 2], [2, 1, 2], [2, 2, 1], [1, 1, 1, 2]],
            7: [[1, 2, 2, 2], [2, 1, 2, 2], [2, 2, 1, 2], [1, 1, 2, 2, 1], [2, 1, 1, 2, 1]]
        }
    },
    '抒情': {
        themes: ['lyric', 'pastoral'],
        openings: {
            5: [[1, 2, 2], [2, 1, 2], [1, 1, 1, 2], [1, 2, 1, 1], [1, 1, 2, 1]],
            7: [[1, 2, 2, 2], [2, 1, 2, 2], [1, 1, 2, 2, 1], [1, 2, 1, 2, 1], [1, 1, 1, 2, 2]]
        },
        closings: {
            5: [[2, 1, 2], [1, 2, 2], [2, 2, 1], [1, 1, 1, 2]],
            7: [[2, 2, 1, 2], [1, 2, 2, 2], [2, 1, 2, 2], [1, 1, 2, 2, 1]]
        }
    },
    '送别': {
        themes: ['farewell'],
        openings: {
            5: [[2, 1, 2], [2, 2, 1], [1, 2, 2], [2, 1, 1, 1]],
            7: [[2, 2, 1, 2], [2, 1, 2, 2], [4, 1, 2], [2, 1, 1, 1, 2], [4, 2, 1]]
        },
        closings: {
            5: [[1, 2, 2], [2, 1, 2], [1, 1, 1, 2], [2, 2, 1]],
            7: [[1, 2, 2, 2], [2, 1, 2, 2], [1, 1, 2, 2, 1], [2, 2, 1, 2], [1, 2, 1, 2, 1]]
        }
    }
};

let currentPoem = '';
let history = [];

function getRandomItem(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function getStyleForTheme(theme) {
    for (const [style, config] of Object.entries(poemStyleTemplates)) {
        if (config.themes.includes(theme)) {
            return style;
        }
    }
    return null;
}

function generateLine(charsPerLine, startWord = '', theme = null, keywords = [], preferredPatterns = null) {
    let line = startWord;
    let remaining = charsPerLine - startWord.length;

    if (remaining <= 0) return line.slice(0, charsPerLine);

    const themeVocab = theme && vocabulary.themes[theme] ? vocabulary.themes[theme] : null;

    function getWord(category) {
        if (themeVocab && themeVocab[category] && themeVocab[category].length > 0) {
            return getRandomItem(themeVocab[category]);
        }
        if (vocabulary[category] && vocabulary[category].length > 0) {
            return getRandomItem(vocabulary[category]);
        }
        return getRandomItem(vocabulary.nouns);
    }

    function getByLength(len) {
        if (len === 4) {
            if (Math.random() < 0.35) {
                return getWord('nouns') + getWord('nouns');
            }
            return getRandomItem(vocabulary.collocations);
        }
        if (len === 2) return getWord('nouns');
        if (len === 1) {
            const cats = ['verbs', 'adjectives', 'adverbs', 'quantity'];
            return getWord(getRandomItem(cats));
        }
        return getWord('nouns').slice(0, len);
    }

    function getPatternsFor(rem) {
        const map = {
            1: [[1]],
            2: [[2], [1, 1]],
            3: [[2, 1], [1, 2], [1, 1, 1]],
            4: [[2, 2], [2, 1, 1], [1, 2, 1], [1, 1, 2], [1, 1, 1, 1]],
            5: [[2, 1, 2], [2, 2, 1], [1, 2, 2], [2, 1, 1, 1], [1, 2, 1, 1], [1, 1, 2, 1]],
            6: [[2, 2, 2], [2, 2, 1, 1], [2, 1, 2, 1], [1, 2, 2, 1], [2, 1, 1, 2], [4, 2], [2, 4], [4, 1, 1], [1, 1, 2, 2]],
            7: [[2, 2, 2, 1], [2, 1, 2, 2], [4, 2, 1], [2, 1, 4], [2, 2, 1, 2], [1, 2, 2, 2], [4, 1, 2], [2, 1, 2, 1, 1], [1, 2, 1, 2, 1]]
        };
        return map[rem] || [[...Array(rem).fill(1)]];
    }

    let patternList;
    if (preferredPatterns) {
        patternList = preferredPatterns.filter(p => p.reduce((a, b) => a + b, 0) === remaining);
    }
    if (!patternList || patternList.length === 0) {
        patternList = getPatternsFor(remaining);
    }
    const pattern = getRandomItem(patternList);
    const segments = pattern.map(len => getByLength(len));

    line += segments.join('');
    return line.slice(0, charsPerLine);
}

function generateNormalPoem(poemType, keywords = []) {
    const config = poemTemplates[poemType];
    const lines = [];
    const keywordList = keywords.filter(k => k.trim());
    const themeNames = ['spring', 'summer', 'autumn', 'winter', 'landscape', 'pastoral', 'windMoon', 'farewell', 'lyric'];
    const theme = getRandomItem(themeNames);
    const style = getStyleForTheme(theme);

    for (let i = 0; i < config.lines; i++) {
        let startWord = '';
        if (keywordList.length > 0 && i < keywordList.length) {
            startWord = keywordList[i];
        }

        let preferredPatterns = null;
        if (i === 0 && Math.random() < 0.7 && style && poemStyleTemplates[style]) {
            const styleOpenings = poemStyleTemplates[style].openings[config.charsPerLine];
            if (styleOpenings && styleOpenings.length > 0) {
                preferredPatterns = styleOpenings;
            }
        }

        const line = generateLine(config.charsPerLine, startWord, theme, keywordList.slice(i + 1), preferredPatterns);
        lines.push(line);
    }

    return lines;
}

function generateAcrosticPoem(poemType, headWords) {
    const config = poemTemplates[poemType];
    const lines = [];
    const words = headWords.filter(w => w.trim());
    const themeNames = ['spring', 'summer', 'autumn', 'winter', 'landscape', 'pastoral', 'windMoon', 'farewell', 'lyric'];
    const theme = getRandomItem(themeNames);

    if (words.length === 0) {
        words.push(...['春', '风', '得', '意']);
    }

    while (words.length < config.lines) {
        words.push(getRandomItem(vocabulary.nouns)[0]);
    }

    for (let i = 0; i < config.lines; i++) {
        const startWord = words[i % words.length];
        const line = generateLine(config.charsPerLine, startWord, theme);
        lines.push(line);
    }

    return lines;
}

function generatePoem() {
    const poemTypeSelect = document.getElementById('poemType');
    const poemLengthSelect = document.getElementById('poemLength');
    const keywordsInput = document.getElementById('keywords');
    
    const poemType = poemTypeSelect.value;
    const poemLength = poemLengthSelect.value;
    const keywordsText = keywordsInput.value.trim();
    
    let keywords = [];
    if (keywordsText) {
        keywords = keywordsText.split(/[,，\s]+/).filter(k => k.trim());
    }
    
    let lines;
    if (poemType === 'acrostic') {
        const acrosticChars = [];
        keywords.forEach(keyword => {
            for (let char of keyword) {
                acrosticChars.push(char);
            }
        });
        lines = generateAcrosticPoem(poemLength, acrosticChars);
    } else {
        lines = generateNormalPoem(poemLength, keywords);
    }
    
    currentPoem = lines.join('\n');
    displayPoem(lines);
    document.getElementById('actionButtons').style.display = 'flex';
}

function displayPoem(lines) {
    const poemContent = document.getElementById('poemContent');
    poemContent.innerHTML = '';
    
    const poemTextDiv = document.createElement('div');
    poemTextDiv.className = 'poem-text';
    
    lines.forEach(line => {
        const lineDiv = document.createElement('div');
        lineDiv.className = 'poem-line';
        lineDiv.textContent = line;
        poemTextDiv.appendChild(lineDiv);
    });
    
    poemContent.appendChild(poemTextDiv);
}

function copyPoem() {
    if (!currentPoem) return;
    
    navigator.clipboard.writeText(currentPoem).then(() => {
        showToast('诗词已复制到剪贴板！');
    }).catch(() => {
        const textarea = document.createElement('textarea');
        textarea.value = currentPoem;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        showToast('诗词已复制到剪贴板！');
    });
}

function savePoem() {
    if (!currentPoem) return;
    
    const poemType = document.getElementById('poemType').value;
    const poemLength = document.getElementById('poemLength').value;
    const keywords = document.getElementById('keywords').value;
    
    const poemRecord = {
        id: Date.now(),
        type: poemType === 'acrostic' ? '藏头诗' : '普通诗词',
        format: getPoemFormatName(poemLength),
        keywords: keywords,
        content: currentPoem,
        timestamp: new Date().toLocaleString('zh-CN')
    };
    
    history.unshift(poemRecord);
    if (history.length > 50) {
        history.pop();
    }
    
    saveHistory();
    renderHistory();
    showToast('诗词已保存到历史记录！');
}

function getPoemFormatName(format) {
    const names = {
        '5jue': '五言绝句',
        '7jue': '七言绝句',
        '5lv': '五言律诗',
        '7lv': '七言律诗'
    };
    return names[format] || format;
}

function saveHistory() {
    try {
        localStorage.setItem('poemHistory', JSON.stringify(history));
    } catch (e) {
        console.error('保存历史记录失败:', e);
    }
}

function loadHistory() {
    try {
        const saved = localStorage.getItem('poemHistory');
        if (saved) {
            history = JSON.parse(saved);
        }
    } catch (e) {
        console.error('加载历史记录失败:', e);
        history = [];
    }
    renderHistory();
}

function renderHistory() {
    const historyList = document.getElementById('historyList');
    
    if (history.length === 0) {
        historyList.innerHTML = '<p class="empty-hint">暂无历史记录</p>';
        return;
    }
    
    historyList.innerHTML = '';
    
    history.forEach((item, index) => {
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';
        
        const deleteBtn = document.createElement('span');
        deleteBtn.className = 'history-item-delete';
        deleteBtn.textContent = '×';
        deleteBtn.onclick = (e) => {
            e.stopPropagation();
            deleteHistoryItem(index);
        };
        
        const title = document.createElement('div');
        title.className = 'history-item-title';
        title.textContent = `${item.format} · ${item.type}`;
        
        const time = document.createElement('div');
        time.className = 'history-item-time';
        time.textContent = item.timestamp;
        
        historyItem.appendChild(deleteBtn);
        historyItem.appendChild(title);
        historyItem.appendChild(time);
        
        historyItem.onclick = () => {
            loadHistoryItem(index);
        };
        
        historyList.appendChild(historyItem);
    });
}

function deleteHistoryItem(index) {
    history.splice(index, 1);
    saveHistory();
    renderHistory();
    showToast('已删除历史记录');
}

function clearHistory() {
    if (history.length === 0) return;
    if (confirm('确定要清空所有历史记录吗？')) {
        history = [];
        saveHistory();
        renderHistory();
        showToast('历史记录已清空');
    }
}

function loadHistoryItem(index) {
    const item = history[index];
    const lines = item.content.split('\n');
    currentPoem = item.content;
    displayPoem(lines);
    document.getElementById('actionButtons').style.display = 'flex';
    showToast('已加载历史作品');
}

function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 2500);
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('generateBtn').addEventListener('click', generatePoem);
    document.getElementById('copyBtn').addEventListener('click', copyPoem);
    document.getElementById('saveBtn').addEventListener('click', savePoem);
    document.getElementById('clearHistoryBtn').addEventListener('click', clearHistory);
    
    loadHistory();
});
