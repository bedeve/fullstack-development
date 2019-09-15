---
name: 1.1.1 Install Cubic
route: linux/install/cubic
---

[original](https://www.techrepublic.com/article/how-to-create-a-custom-ubuntu-iso-with-cubic/)

Cubic is a custom Ubuntu ISO creator. With it you can take a standard Ubuntu ISO image, install all the third-party software you need, and then create a custom, bootable (and installable) image from that. In the end, you'll have a Ubuntu platform that includes all the software you need, without having to add everything post-install.

I'm going to walk you through the process of installing and using Cubic. Once you know this tool, you won't want to work without it.


## Installation
```sh
sudo apt-add-repository ppa:cubic-wizard/release
sudo apt-key adv --keyserver keyserver.ubuntu.com --recv-keys 6494C6D6997C215E
sudo apt update
sudo apt install cubic
```

That's all there is to the installation. You should find an entry for Cubic in your desktop menu. Click to start it and you'll be prompted for your sudo password.

## Usage

The first screen requires you select a project directory . You can have only one project per directory, so make sure you are using a new directory for each custom ISO (or delete all project files when the task is complete).

Create a new project directory for the ISO.



In the next window, you must select the original ISO image to be used for the creation of the custom image . I'm going to use Ubuntu 16.04 and add Kubernetes to that image. Once you select the image, the rest of the information will automatically fill in. Do not change anything in the Original ISO section. You can, however, change information in the Custom ISO section.



All the information regarding your images is automatically filled out.



Click Next and you will eventually find yourself in a terminal window indicating you are in a chroot environment .




Our chroot environment, ready for application installation.



From this terminal window, install all the applications you need in the standard fashion (via apt or apt-get). Once you've completed this task, click Next. You will then see the kernel image being used for the ISO. You can't change this, so click Next again. At this point Cubic will begin building your custom ISO . When it completes, click the Finish and your new disk image is ready and can be found in your project directory.




Cubic doing its thing.



The final screen does allow you to delete all project files (minus the generated disk image). Unless you have a need for the files, I'd recommend you do this. Burn your ISO image onto a CD/DVD or USB drive (or use it for a VirtualBox VM) and you're ready to install your custom platform.

