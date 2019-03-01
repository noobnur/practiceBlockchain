Things I learnt here:
1. HTTP and Websockets Basics. Good youtube: A beginner's guide to Websockets: https://www.youtube.com/watch?v=FmaBZcQzL-Y <br />
Analogy my friend (who knows nothing about http and websockets) <br />
"Do you know what is websockets?" <br />
"Yes," he lied, "Websockets are ... socks. That people wear... to get super powers," he guessed. <br />
"What kind of super powers?" <br />
"That depends.." he says mock-wisely. <br />
<br />
While websockets are DEFINITELY not socks that people can wear, this analogy did somewhat help me make sense of HTTP and websockets. <br />
<br />
- Websocket is an upgrade ("super power haha") from the regular HTTP. It allows a real-time communication between server and client rather than HTTP's communication via REST on-requests. <br />
- I was confused why this tutorial need HTTP_PORT And P2P_PORT when .. isnt it one port? Technically, we can have the same port for websocket and http (google searched that), but to Run the application that has get and post requests, we would need the HTTP protocol. To connect and get real time data updates, we would need to connect via Websockets. So... in a way, We need both the "person" (http) and the "sock" (ws). <br />

2. For blockchain, only the longest and most up-to-date chain will be across all. I tried to create one instance that is not connected to ALL the diff peers. Some data will be lost :/

3. 


