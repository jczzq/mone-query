# mone-query 组件API
![mone-query](/docs/MoneQuery.png)
`mone-query`是基于`element-ui`的查询组件，它通过丰富的配置让你尽可能少的前端编码就可以完成大部分报表需求。

## 必要依赖
`vue` >= 2.4.0

`axios` >= 0.16.0

## 安装
### CommonJS方式
```
npm install mone-query -D
```

### umd方式
```
<script src="../mone-query.min.js"></script>
```

## 快速上手

```
import Vue from "vue";
import MoneQuery from "mone-query";
Vue.use(MoneQuery, {
  // options
  ...
})
```
```
<mone-query border :config="config" :data="data" />
...
import Config from "@/Config.json";
import Data from "@/Data.json";
data() {
  return {
    // 传入请求路径
    config: "/api/config",
    data: "/api/data"
    // or
    // 传入对象
    config: Config.resultData,
    data: Data.resultData
  };
}
```
## 运行机制
1. 校验入参

    `mone-query`有两个必要参数`config`和`data`, config控制表格结构和自定义功能，data渲染数据行，这两个参数可以传入ajax路径字符串，也可以传入json对象，其他类型的参数传入时会抛出异常。注意组件还有其它一些参数可以传入，组件传入的参数与config有一些参数是重复的，甚至你还可以在Vue.use时给所有的组件实例传入默认参数，这是为了增加组件配置的灵活性，不过通过组件直接传入的参数优先级最高，config属性其次，最后是默认配置

2. 根据config参数获取配置

    如果config传入字符串，那么组件首先会发起Get请求查询配置json，这段期间表格会一直loading到请求结束，如果请求失败，表格将会触发`on-error`事件，使用者可以监听事件做后续处理，或者让页面保持错误面板的状态；请求成功的结果将直接作为配置对象使用。如果config传入json，将直接作为配置对象使用(具体结构示例参照`Config.json`)。

3. 根据配置对象渲染表结构

    受配置影响的部分包括：
      - colbox: 工具栏的字段面板
      - cols: 表头
      - ......

4. 根据data参数获取结果集

    如果data传入字符串，那么组件会将之作为ajax路径查询结果集。如果data传入json，将直接作为结果集使用（具体结构示例参照`Data.json`）。

5. 有时候在结果集渲染之前需要对某些字段进行处理，比如映射新值、时间转换等等，这时提供formatters对象，这是一个属性名为col.prop、属性值为该列过滤函数的对象，过滤函数有四个形参：`row, column, cellValue, index`


## MoneQuery Attributes
| 属性名 | 类型 | 含义 | 可选值 | 默认值 |
| -- | -- | -- | -- | -- |
| *config | Object , String | 表头列 | ajax路径\配置对象 | {} |
| *data | Array , String | 数据行 | ajax路径\数据集合 | [] |
| height | String/Number | Table高度 | auto\80\80px | auto |
| max-height | String/Number | Table的最大高度 | - | - |
| border | Boolean | 是否带有纵向边框 | - | false |
| primary-key | String | 主键(数据行多选时必要) | - | id |
| page-name | String | 分页参数中的pageSize键名 | - | pageIndex |
| size-name | String | 分页参数中的pageSize键名 | - | pageSize |
| rows-name | String | ajax请求结果集键名 | - | resultData.rows |
| total-name | String | ajax请求结果总数键名 | - | resultData.total |
| colbox | Object | 字段显示框方位 | - | { placement: "top", width: "540px", trigger: "click" } |
| visible-fields | Boolean,Array | 默认显示字段 | true: 全部显示; false: 全部隐藏; ["propA", "propB", ...] | true |
| visible-fields-config | Array\<FieldGroup> | 字段在工具栏的显示配置 | - | - |
| formatters | Object | 包含各个列过滤函数的对象 | - | {} |
| show-action | Boolean | 是否显示右侧操作栏 | - | false |
| show-delete | Boolean | 是否显示删除按钮 | - | false |
| show-header | Boolean | 是否显示表头（包含筛选条件） | - | true |
| show-selection | Boolean | 是否显示多选框 | - | true |
| show-index | Boolean | 是否自定义序列 | - | false |

## MoneQuery Events
| 事件名 | 说明 | 参数 |
| -- | -- | -- |
| delete | 点击删除按钮触发 | selection |
| search | 点击查询按钮触发 | parameters |


### config Attributes
| 属性名 | 类型 | 含义 | 可选值 | 默认值 |
| -- | -- | -- | -- | -- |
| primary-key | String | 主键(数据行多选时必要) | - | id |
| cols | Array\<Col> | 列 | - | id |
| page-name | String | 分页参数中的pageSize键名 | - | pageIndex |
| size-name | String | 分页参数中的pageSize键名 | - | pageSize |
| rows-name | String | ajax请求结果集键名 | - | resultData.rows |
| total-name | String | ajax请求结果总数键名 | - | resultData.total |
| colbox | Object | 字段显示框方位 | - | { placement: "top", width: "540px", trigger: "click" } |
| visible-fields | Boolean,Array | 默认显示字段 | true: 全部显示; false: 全部隐藏; ["propA", "propB", ...] | true |
| visible-fields-config | Array\<FieldGroup> | 字段在工具栏的显示配置 | - | - |
| show-action | Boolean | 是否显示右侧操作栏 | - | false |
| show-delete | Boolean | 是否显示删除按钮 | - | false |
| show-header | Boolean | 是否显示表头（包含筛选条件） | - | true |
| show-selection | Boolean | 是否显示多选框 | - | true |
| show-index | Boolean | 是否自定义序列 | - | false |


#### colbox Attributes
| 属性名 | 类型 | 含义 | 可选值 | 默认值 |
| -- | -- | -- | -- | -- |
| placement | String | 展示方位 | - | top |
| width | String | 面板宽度 | - | 540px |
| trigger | String | 触发事件类型 | - | click |

### Col class
| 属性名 | 类型 | 含义 | 可选值 | 默认值 |
| -- | -- | -- | -- | -- |
| label | String | 列标题 | - | - |
| prop | String | 列字段名 | - | - |
| type | String | 列字段类型 | `varchar`、`option`、`date`、`datetime` | - |
| width | String | 列宽度 | width | width |
| order | Number | 排列顺序 | - | - |
| action | String | 查询类型 | - | varchar:lk,option:in; data:lt& gt; datetime:le& ge |
| placeholder | String | 输入提示 | - | - |
| fixed | Boolean | 是否固定列 | - | - |

#### Col.type enum
| 枚举值 | 含义 |
| -- | -- |
| varchar | 文本 |
| option | 多选 |
| date | 日期 |
| datetime | 日期时间 |

#### FieldGroup class
| 属性名 | 类型 | 含义 | 可选值 | 默认值 |
| -- | -- | -- | -- | -- |
| title | String | 组标题 | - | - |
| order | String | 排列顺序 | - | - |
| selection | Array | 选中的 | - | - |
| checkAll | Boolean | 是否全选 | - | true |
| isIndeterminate | Boolean | 是否半选 | - | false |
| colProps | Array | 组成员 | - | - |


## 查询**配置**标准结构（application/json）
- resultCode 响应码
- resultData 响应结果
  - primaryKey `String` 主键prop（默认：id）
  - rowsName `String` 结果集属性名，将根据rowsName指定的属性名获取目标结果集(默认: resultData.rows)
  - totalName `String` 结果总数属性名，将根据totalName指定的属性名获取目标结果总数(默认: resultData.total)
  - pageName `String` 当前页属性名，将根据pageName指定的属性名设置分页参数(默认: pageIndex)
  - sizeName `String` 每页条数属性名，将根据sizeName指定的属性名设置分页参数(默认: pageSize)
  - pageSize `Number` 默认每页查询的数据数量(默认: 20)
  - cols `Array` 列头（字段）对象集合
    - label `String` 标题
    - prop `String` 属性名
    - type `String` 属性类型
      - varchar 文本
      - option 多选
      - date 日期
      - datetime 日期时间
      - bit 单选（暂不支持）
      - int 数字（暂不支持）
      - time 时间（暂不支持）
    - width `String` 列宽
    - order `Number` 排列顺序
  - colbox `Object` 可选字段配置
    - placement `String` 展示方位（默认：top）
    - width `String` 面板宽度（默认：540px）
    - trigger `String` 触发事件类型（默认：click）
    - value `Array` （默认：所有字段）


## 查询**参数**标准结构（application/json）
- colProps `Array` 要查询的字段列
- params `Array` 查询参数字段
  - field `String`
  - action `String`
    - eq 等于
    - ne 不等于
    - in 包含在
    - ni 不包含在
    - sw start with
    - ew end with
    - lk like
    - gt 大于
    - lt 小于
    - ge 大于等于
    - le 小于等于
  - filedType `String`
    - varchar 字符串
    - date 日期范围
    - datetime 日期时间范围
    - bit 单选（暂不支持）
    - int 数字（暂不支持）
    - time 时间（暂不支持）
  - value `any`
- sort `Array` 排序字段
  - prop `String` 字段名
  - type `String` 排序方式
    - asc 正序
    - desc 降序
- page `Object`
  - pageIndex `Number` 当前页（默认：1）
  - pageSize `Number` 每页多少条（默认：20）
```
# 查询参数示例
cols: ["name", "age", "grade", "isMarried", "birthday", "schoolTime"],
params: [
  {
    field: "name",
    action: "lk",
    filedType: "varchar",
    value: "李",
  },
  {
    field: "birthday",
    action: "lt",
    filedType: "datetime",
    value: "2019-04-13",
  },
  {
    field: "birthday",
    action: "ge",
    filedType: "datetime",
    value: "2019-03-13",
  }
]
sort: [
  {
    prop: "age',
    type: "asc"
  }
],
page: {
  pageIndex: 1,
  pageSize: 20
}
```

## 查询**结果集**标准结构（application/json）
- resultCode 响应码
- resultData 响应结果
  - rows 结果集
  - total 结果总数


## TODO
- [X] 左侧锁定列
- [X] 右侧操作栏
- [x] 批量删除
- [x] 排列顺序
- [X] 默认查询动作
  - varchar lk
  - option in 
  - data lt & gt
  - datetime le & ge
- option多选下拉框类型
- [x] 结果集formatter处理

## 轻量版
mone-query默认依赖element-ui部分组件和axios请求库，这里有两个构建版供你的应用选择：
- 全部引入(js≈360kb, style≈103kb)：包括element相关组件(可以在应用中使用这些组件，因为它们已经全局注册过了)；另外是axios。
- 只引入核心代码(≈24kb, style≈1kb)，如果你的应用已经引入了element和axios，那建议只引入核心代码即可。
  ```
    import "mone-query/lib/lite/style.css";
    import moneQuery from "mone-query/lib/lite";
    ...
  ```
PS： 这里说来说去最终不影响物质守恒，如果你不是太关心你应用的构建体积可以忽略
