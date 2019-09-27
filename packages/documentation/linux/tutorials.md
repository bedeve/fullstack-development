---
name: 1.2 Tutorials
route: linux/tutorials
---
## mkusb

[original](https://www.howtogeek.com/howto/14912/create-a-persistent-bootable-ubuntu-usb-flash-drive)



### How to Make a Persistent Ubuntu USB Drive on Ubuntu

You’ll need a computer already running Ubuntu to perform this process. You’ll also need a USB drive with enough storage capacity to set up persistence. We used a 16 GB drive, but an 8 GB drive would have worked as well. The bigger the drive, the more persistent storage you can have.

The grub, boot and Ubuntu partitions take up less than 2 GB. The remainder of the space on the USB drive will be used for the `casper-rw` and the `usbdata` partitions.

The `casper-rw` partition is used for persistent storage. For example, software you install and settings files will be stored here.

The `usbdata` partition will be formatted with the NTFS file system. It will be accessible to Linux, Windows, and macOS. This partition is also available from within the live Ubuntu on the USB drive. This means any files copied to the `usbdata` partition from another computer will be accessible to your live Ubuntu.

In other words, the `usbdata` partition acts as a “shared folder” between your live Ubuntu and any other computer you plug your USB drive into. That’s pretty cool.



First, you’ll have to download the [Ubuntu ISO file](https://www.ubuntu.com/download) or [Linux Mint](https://www.linuxmint.com) you want to place on the USB drive.

Second, the tool you’re going to use is called `mkusb`. It is not part of the standard Ubuntu installation. You will need to install it. To do so, enter the following three commands. The first command adds the `mkusb` repository so that Ubuntu knows where to install `mkusb` from.

```sh
sudo add-apt-repository ppa:mkusb/ppa
sudo apt-get update
sudo apt install --install-recommends mkusb mkusb-nox usb-pack-efi
```



The next command forces Ubuntu to refresh its package lists for the registered repositories.




We can now proceed to install the `mkusb` package, with this command:

```sudo apt install --install-recommends mkusb mkusb-nox usb-pack-efi```



The `mkusb` program does a terrific job of identifying USB drives. That’s great, but there’s nothing like knowing for yourself. When `mkusb` tells you it is going to completely wipe a particular drive, you can be sure it’s the USB drive you are planning on using and not another device on your system.

In a terminal window, type the following command. The `lsblk` command [lists the block devices](http://man7.org/linux/man-pages/man8/lsblk.8.html) on your computer. Each drive has a block device associated with it.

```lsblk```

The output from `lsblk` will show the drives currently connected to your computer. There is one internal hard drive on this machine called `sda` and there is one partition on it called `sda1`.


Plug in your USB drive and use the `lsblk` command once more. The output from `lsblk` will have changed. The USB drive will now be listed in the output.


There is a new entry called `sdb` in the list. It has one partition called `sdb1`. That’s the USB drive.

If you have more than one drive in your computer already, the name of your USB drive will be different. Regardless of how it is named, the device that was _not_ in the previous `lsblk` listing _must_ be the USB drive.

Once you know which device your USB drive is, you can launch `mkusb`. Press the Super (Windows) key and type “mkusb”. The `mkusb` icon will appear. Click the icon or press Enter.

A dialog will ask you whether you wish to run the dus (Do USB Stuff) version of `mkusb`. Click the “Yes” button.


A terminal window with a black background will appear and a dialog box will prompt you for your password. Enter your password and click the “OK” button.



**Warning**: This process will wipe the contents of the USB drive!

Click “OK” in the warning dialog to acknowledge you understand this.



Click the “Install (make a boot device)” entry in the list and click the “OK” button.



Select the “‘Persistent live’ – only Debian and Ubuntu” entry in the list and click the “OK” button.



A file browser dialog will appear. Browse to the Ubuntu ISO file you downloaded, select it, and click the green “OK” button.

In the screenshot below, we’re selecting the Ubuntu 19.04 ISO image from the Downloads folder.



You’ll see a list of the USB drives connected to your computer. This allows you to select the appropriate USB drive.

There was only one USB drive connected to the test machine used for this article. As we confirmed above, it is called `sdb`. We’ve confirmed that’s the USB drive we want to use so we can proceed with confidence. Click the “OK” button.



When the dialog shown below appears, select the “usb-pack-efi (default grub from ISO file)” entry in the list and click the “OK” button.



You have one more option to choose. You can select what percentage of the storage space is for persistent storage in the `casper-rw` partition. The remainder will be used for the `usbdata` partition, which has the NTFS file system and can also be accessed from Windows PCs and Macs.

If you’re happy to have the available space on the USB drive shared equally between these two partitions, leave the slider at its default value and click the “OK” button.



Now, we just have to tell `mkusb` that we’re happy with all of our choices and that it should proceed.

To be clear, this is the last point at which you can back out. If you’re certain you wish to proceed, select the “Go” radio button and click the “Go” button.



A progress bar shows you how close the creation process is to completion.



The final stage of the creation is to flush the file system buffers to the USB drive. You are also advised to wait until you see the phrase “Work done”. That will indicate the process has completed.



When the process has completed you will see a dialog with the phrase “Work done” highlighted in green. Click the “OK” button. If any other dialogs appear, close them by clicking on the “Quit” button.



A few more lines of output will scroll through the terminal window. You will be prompted to press “Enter” when you are ready.



When you press “Enter,” the terminal window will close. You can now either reboot your computer and [boot from the USB drive](https://www.howtogeek.com/129815/beginner-geek-how-to-change-the-boot-order-in-your-computers-bios/) or unplug the USB drive, take it to another computer, and boot it there.

## cubic

[original](https://www.techrepublic.com/article/how-to-create-a-custom-ubuntu-iso-with-cubic/)

Cubic is a custom Ubuntu ISO creator. With it you can take a standard Ubuntu ISO image, install all the third-party software you need, and then create a custom, bootable (and installable) image from that. In the end, you'll have a Ubuntu platform that includes all the software you need, without having to add everything post-install.

I'm going to walk you through the process of installing and using Cubic. Once you know this tool, you won't want to work without it.


### Installation
```sh
sudo apt-add-repository ppa:cubic-wizard/release
sudo apt-key adv --keyserver keyserver.ubuntu.com --recv-keys 6494C6D6997C215E
sudo apt update
sudo apt install cubic
```

That's all there is to the installation. You should find an entry for Cubic in your desktop menu. Click to start it and you'll be prompted for your sudo password.

### Usage

The first screen requires you select a project directory . You can have only one project per directory, so make sure you are using a new directory for each custom ISO (or delete all project files when the task is complete).

Create a new project directory for the ISO.



In the next window, you must select the original ISO image to be used for the creation of the custom image . I'm going to use Ubuntu 16.04 and add Kubernetes to that image. Once you select the image, the rest of the information will automatically fill in. Do not change anything in the Original ISO section. You can, however, change information in the Custom ISO section.



All the information regarding your images is automatically filled out.



Click Next and you will eventually find yourself in a terminal window indicating you are in a chroot environment .




Our chroot environment, ready for application installation.



From this terminal window, install all the applications you need in the standard fashion (via apt or apt-get). Once you've completed this task, click Next. You will then see the kernel image being used for the ISO. You can't change this, so click Next again. At this point Cubic will begin building your custom ISO . When it completes, click the Finish and your new disk image is ready and can be found in your project directory.




Cubic doing its thing.



The final screen does allow you to delete all project files (minus the generated disk image). Unless you have a need for the files, I'd recommend you do this. Burn your ISO image onto a CD/DVD or USB drive (or use it for a VirtualBox VM) and you're ready to install your custom platform.

