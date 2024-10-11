![2024-10-11_135505](https://github.com/user-attachments/assets/40bd1f50-d7cc-4a87-af96-71eaac3f81de)# codeList

#### 前提：使用 vue3+ts；d3 绘图；对图进行交互操作

放一些自写代码块=>d3,echarts,奇思妙想逻辑块....

#### 框选放大 d3

![1712825534198](https://github.com/xtt-nora/codeList/assets/100661009/0044d3f7-1a9e-4611-96a0-884912fcf916)
![截屏2024-04-11 16 48 15 (2)](https://github.com/xtt-nora/codeList/assets/100661009/59e5c1cc-9db7-49be-b76e-cc8c27488434)
<img width="100" alt="截屏2024-04-11 16 48 43" src="https://github.com/xtt-nora/codeList/assets/100661009/6175399c-e0f5-4732-af7f-408e9e5b5301">

#### x 轴放大

<img width="300" alt="截屏2024-04-11 16 54 11" src="https://github.com/xtt-nora/codeList/assets/100661009/1e723d12-a53d-4c69-8249-124883ae9e1f">
<img width="300" alt="截屏2024-04-11 16 54 15" src="https://github.com/xtt-nora/codeList/assets/100661009/bd9d52da-4b2c-4c63-9490-540cfbc2242f">

#### y 轴放大

<img width="300" alt="截屏2024-04-11 16 57 14" src="https://github.com/xtt-nora/codeList/assets/100661009/25991a7c-6e5c-42a5-a8bb-dbf512797543">
<img width="300" alt="截屏2024-04-11 16 57 19" src="https://github.com/xtt-nora/codeList/assets/100661009/6c659c12-33cd-4dbb-8cc7-6b8e1c3617e3">

## 封装 echart 及对其操作的工具箱（包括框选，上一步下一步，还原等功能）

封装代码在 Echarts 文件夹中，使用 hooks 钩子记录多图操作以及 store 中的 history.ts 进行通信（hooks>useHistory.ts 以及 store>history.ts|| 需要下载 immer）;
![2024-10-11_135505](https://github.com/user-attachments/assets/3d681d61-867a-4263-bae4-54d91bf5621f)
![2024-10-11_135526](https://github.com/user-attachments/assets/3e594ee1-c254-48ec-be17-3d146ecac004)
