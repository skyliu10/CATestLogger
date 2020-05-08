# CA Test Logger
This project is built off the open source extension User Test Logger. It extracts Computer Anxiety related HCI metrics tracked by User Test Logger and produces a Computer Anxiety results page once the HCI data logging has finished. 
Citation: Santana, V. F., and Silva, F. E. F. 2019. User Test Logger: An Open Source Browser Plugin for Logging and Reporting Local User Studies. In Proceedings of XXI International Conference on Human-Computer Interaction (HCII 2019). Springer.

This version of the User Test Logger (called CA Test Logger) includes all the aspects of User Test Logger with the additions of a refresh button, a Computer Anxiety results page, and time stamps on the mouse plot. Below is information about User Test Logger and how to setup this extension. 

# User Test Logger

Tooling user studies tasks is fundamental to reduce the burden of evaluators, practitioners, facilitators, and observers during user interface (UI) evaluations. However, available tools for collecting detailed data (i.e., beyond clicks streams) are paid or have a complex setup. In this context, we propose a general-purpose web browser plugin for Firefox to be used in local user studies. It provides detailed data logging, log download, and reporting features. The tool is freely available so that Human-Computer Interaction (HCI) practitioners can use it as a core tool for empirical evaluations or additional data source in mixed methods evaluations.

## Setup

The easiest way to tryout the tool is to:

1. Download the zip file located at https://github.com/IBM/user-test-logger/archive/master.zip;
2. Unzip the downloaded file and place it at your preferred location;
3. Write about:debugging at the address bar;
4. Click on "Load Temporary add-on";
5. Locate the manifest.json file and selected it;
5. Confirm.

Checkout this video showing the setup procedure:

[![User Test Logger - Setup](http://img.youtube.com/vi/0ihIVZ25s0E/0.jpg)](https://youtu.be/0ihIVZ25s0E "User Test Logger - Setup")

## Logging

Once the plugin is loaded, you will be able to see the "L" icon. After clicking at the "L" icon, you will be able to select the events of interest grouped by type of event, e.g., mouse, keyboard, etc.

Once you select the events of interest, you can click record. After that, all events triggered of the type you selected will be logged.

Checkout this video showing the logging procedure:

[![User Test Logger - Logging](http://img.youtube.com/vi/O1TcKH9kUnY/0.jpg)](https://youtu.be/O1TcKH9kUnY "User Test Logger - Logging")

### Log File

The log file contains all the DOM events triggered during the recording. It can be downloaded by clicking on "Dump raw data". Each line in the log file is an event, whose structure is described by the first line. 

#### Example
A simple task of searching a name at google was performed as an example:

At the beginning of the file, it's possible to see the header containing the log lines' structure and the "pageview" event triggered at the google page:
![alt log file](https://raw.githubusercontent.com/IBM/user-test-logger/master/imgs/header-google-search.png)

Next, the search with the name "donald knuth" is submitted:
![alt log file](https://raw.githubusercontent.com/IBM/user-test-logger/master/imgs/typing-knuth.png)
![alt log file](https://raw.githubusercontent.com/IBM/user-test-logger/master/imgs/typing-knuth-2.png)

Then the search web address is loaded:
![alt log line](https://raw.githubusercontent.com/IBM/user-test-logger/master/imgs/google-search.png)
![alt log line](https://raw.githubusercontent.com/IBM/user-test-logger/master/imgs/google-search-2.png)
![alt log line](https://raw.githubusercontent.com/IBM/user-test-logger/master/imgs/google-search-3.png)

Finally, wikipedia page about Donald Knuth is reached:
![alt log file](https://raw.githubusercontent.com/IBM/user-test-logger/master/imgs/entering-wikipedia.png)


## Analysis

### Usage Graph

The usage graph can also be seen as the combination of walks (non-empty alternating sequence of nodes and edges) representing what, where, and when users performed actions. In the usage graph a node is identified by its label, which is the concatenation of the event name and an identifier of the UI element where the event occurred. Moreover, each node counts on information regarding the total of sessions they occurred, mean distance from the root node, mean timestamp, among others.

For more details, please refer to the paper [WELFIT: A remote evaluation tool for identifying web usage Patterns through client-side logging](https://www.researchgate.net/publication/270914330_WELFIT_A_remote_evaluation_tool_for_identifying_web_usage_Patterns_through_client-side_logging), from Santana and Baranauskas.

### Heatmap

The heatmap is a simplified version of a fixation visualization, usually used for analyzing eyetracking results. 
The heatmap generated by the tool is performed according to the mouse events. 
It considers mouse fixations, as an analogy to eye fixations.
The fixations are computed according to the dispersion algorithm presented in the paper [Identifying fixations and saccades in eye-tracking protocols](https://dl.acm.org/citation.cfm?id=355028), from Salvucci and Goldberg.

### Mouse Plot

The mouse plot shows mouse movements, clicks and double clicks. It can be useful for comparing task performance and showing user's mouse path.

Checkout this video showing an overview of reporting capabilities:

[![User Test Logger - Analysis](http://img.youtube.com/vi/nzL9ghswHhg/0.jpg)](https://youtu.be/nzL9ghswHhg "User Test Logger - Analysis")


