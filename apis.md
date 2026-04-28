# JMComic (禁漫天堂) 移动端 API 接口文档

> ⚠️ **免责声明**：本文档基于开源爬虫项目 `hect0x7/JMComic-Crawler-Python` 逆向整理，仅供技术学习与交流。非官方开放接口，随时可能变更。请遵守相关法律法规及目标网站的使用条款。

---

## 🌐 一、 基础配置

| 配置项 | 说明 |
|:---|:---|
| **协议** | `HTTPS` |
| **基础域名** | 动态获取（示例：`www.cdnaspa.vip`、`www.cdnaspa.club` 等）。需从项目内置 `DOMAIN_API_LIST` 或 `/setting` 接口获取最新可用域名 |
| **请求格式** | `application/x-www-form-urlencoded` 或 `application/json` |
| **响应格式** | 加密的 JSON 字符串（`data` 字段为 Base64 + AES 加密，需解密后解析） |

---

## 🔑 二、 通用请求规范

### 2.1 请求头（Headers）
```http
Accept-Encoding: gzip, deflate
user-agent: Mozilla/5.0 (Linux; Android 9; V1938CT Build/PQ3A.190705.11211812; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/78.0.3904.108 Mobile Safari/537.36
token: {动态生成}
tokenparam: {ts},{APP_VERSION}
```

### 2.2 签名生成逻辑
| 字段 | 生成规则 | 示例 |
|:---|:---|:---|
| `ts` | 当前 Unix 时间戳（秒） | `1713801234` |
| `token` | `md5(f"{ts}18comicAPP")` | `a1b2c3d4...` |
| `tokenparam` | `f"{ts},2.0.19"` | `1713801234,2.0.19` |

### 2.3 响应解密流程
1. 提取响应 JSON 中的 `data` 字段（Base64 字符串）
2. Base64 解码得到二进制数据
3. AES-ECB 解密（密钥：`md5(f"{ts}185Hcomic3PAPP7R").encode('utf-8')`）
4. 移除 PKCS7 Padding（`data = data[:-data[-1]]`）
5. UTF-8 解码 → 得到明文 JSON

---

## 📡 三、 核心接口详情

### 3.1 获取作品详情
| 项目 | 值 |
|:---|:---|
| **请求方法** | `GET` |
| **请求路径** | `/album` |
| **完整URL示例** | `https://{domain}/album?id=123456` |

**📥 入参（Query）**
| 参数名 | 类型 | 必填 | 说明 |
|:---|:---|:---|:---|
| `id` | `string` / `int` | ✅ | 作品ID（Album ID，纯数字） |

**📤 出参（解密后 `data` 字段核心结构）**
```json
{
  "id": "123456",
  "name": "作品标题",
  "author": ["作者1", "作者2"],
  "description": "作品简介",
  "total_views": "41314",
  "likes": "918",
  "comment_total": "5",
  "tags": ["全彩", "中文", "原创"],
  "works": [],
  "actors": [],
  "series": [
    { "id": "487043", "name": "第1話", "sort": "1" },
    { "id": "487044", "name": "第2話", "sort": "2" }
  ],
  "related_list": [...]
}
```
> 📌 **注意**：此接口**不返回**图片列表与 `scramble_id`（解密种子）。需通过章节接口获取。

---

### 3.2 获取章节详情 & 图片数量
| 项目 | 值 |
|:---|:---|
| **请求方法** | `GET` |
| **请求路径** | `/chapter` |
| **完整URL示例** | `https://{domain}/chapter?id=487043` |

**📥 入参（Query）**
| 参数名 | 类型 | 必填 | 说明 |
|:---|:---|:---|:---|
| `id` | `string` / `int` | ✅ | 章节ID（Photo ID，纯数字） |

**📤 出参（解密后 `data` 字段核心结构）**
```json
{
  "id": "487043",
  "series_id": "123456",
  "name": "第1話",
  "sort": "1",
  "tags": "慾望 調教 NTL",
  "images": [
    "00001.webp",
    "00002.webp",
    "00003.webp",
    "...",
    "00050.webp"
  ]
}
```
**🖼️ 图片数量获取方式**：
```python
image_count = len(response_data["data"]["images"])
```

---

### 3.3 获取图片解密种子 (`scramble_id`)
| 项目 | 值 |
|:---|:---|
| **请求方法** | `GET` |
| **请求路径** | `/chapter_view_template` |
| **完整URL示例** | `https://{domain}/chapter_view_template?id=487043&mode=vertical&page=0&app_img_shunt=1&express=off&v=1713801234` |

**📥 入参（Query）**
| 参数名 | 类型 | 必填 | 默认值 | 说明 |
|:---|:---|:---|:---|:---|
| `id` | `string` | ✅ | - | 章节ID |
| `mode` | `string` | ✅ | `vertical` | 阅读模式 |
| `page` | `string` | ✅ | `0` | 起始页码 |
| `app_img_shunt` | `string` | ✅ | `1` | 图片分流标识 |
| `express` | `string` | ✅ | `off` | 是否精简模式 |
| `v` | `string` | ✅ | `{ts}` | 当前时间戳 |

**📤 出参**：
- **响应类型**：`text/html`（非 JSON）
- **提取规则**：使用正则匹配源码中的 `data-album-id` 属性
  ```python
  import re
  html = response.text
  scramble_id = re.search(r'data-album-id="(\d+)"', html).group(1)
  ```

---

## 🖼️ 四、 图片下载与本地解密

### 4.1 图片下载 URL 模板
```
https://cdn-msp.{domain}/media/photos/{photo_id}/{index:05}{ext}
```
**示例**：`https://cdn-msp.jmapiproxy1.cc/media/photos/487043/00001.webp`
> 💡 请求时需携带与章节接口相同的 `user-agent` 及 `Referer` 头。

### 4.2 本地解密算法（垂直分段重排）
1. **计算分割数 `num`**：
   ```python
   if album_id < scramble_id:
       num = 0  # 无需解密
   elif album_id < 268850:
       num = 10
   else:
       x = 10 if album_id < 421926 else 8
       md5_str = hashlib.md5(f"{album_id}{filename}".encode()).hexdigest()
       num = (ord(md5_str[-1]) % x) * 2 + 2  # 结果为偶数: 2~20
   ```
2. **重排逻辑**：将原图按高度均分为 `num` 段，逆序裁剪后重新垂直拼接（首段需包含余数高度）。

---

## ⚠️ 五、 注意事项与最佳实践

| 事项 | 建议 |
|:---|:---|
| **域名失效** | API 域名会定期更换。建议优先使用项目内置的域名获取逻辑，或监听项目 GitHub Releases 更新 |
| **Token 时效** | `token` 基于时间戳生成，**每次请求应重新计算**，避免复用旧值导致 `403` |
| **请求频率** | 禁漫有严格的风控策略。建议请求间隔 `≥1.5秒`，配合代理池与 User-Agent 轮换 |
| **解密依赖** | 需安装 `pycryptodome`（AES解密）与 `Pillow`（图片处理） |
| **合规使用** | 本文档仅用于技术研究。请勿用于商业抓取或侵犯版权，遵守 `robots.txt` 及当地法律法规 |

---
📖 *整理时间：2026-04-28 | 源码版本参考：`hect0x7/JMComic-Crawler-Python` 最新主分支*