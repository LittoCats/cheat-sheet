#!/usr/bin/env sh

######################################################################
# @author      : 程巍巍 (littocats@gmail.com)
# @file        : reset
# @created     : Thursday Nov 18, 2021 10:02:19 CST
#
# @description : 
######################################################################

OS_NAME=$(uname -s)
JB_PRODUCTS="IntelliJIdea CLion PhpStorm GoLand PyCharm WebStorm Rider DataGrip RubyMine AppCode"

if [ $OS_NAME == "Darwin" ]; then
	echo 'macOS:'

	for PRD in $JB_PRODUCTS; do
    	rm -rf ~/Library/Preferences/${PRD}*/eval
    	rm -rf ~/Library/Application\ Support/JetBrains/${PRD}*/eval
	done
elif [ $OS_NAME == "Linux" ]; then
	echo 'Linux:'

	for PRD in $JB_PRODUCTS; do
    	rm -rf ~/.${PRD}*/config/eval
    	rm -rf ~/.config/${PRD}*/eval
	done
else
	echo 'unsupport'
	exit
fi

echo 'done.'
