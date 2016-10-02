from __future__ import division
from pprint import pprint
from sys import stdout
import sys
import signal
import requests
import json
import time

MDN_URL = 'https://developer.mozilla.org'
MDN_WEB_REFERENCE_URL = 'https://developer.mozilla.org/en-US/docs/Web'

MDN_HTML_REFERENCE_URL = 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element'
MDN_CSS_REFERENCE_URL = 'https://developer.mozilla.org/en-US/docs/Web/CSS'
MDN_JS_REFERENCE_URL = 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference'
MDN_EVENTS_REFERENCE_URL = 'https://developer.mozilla.org/en-US/docs/Web/Events'
MDN_SVG_REFERENCE_URL = 'https://developer.mozilla.org/en-US/docs/Web/SVG'
MDN_WEB_API_REFERENCE_URL = 'https://developer.mozilla.org/en-US/docs/Web/API'
MDN_ACCESSIBILITY_REFERENCE_URL = 'https://developer.mozilla.org/en-US/docs/Web/Accessibility'

MDN_CHILDREN_PARAMETER = '$children'
MDN_CHILDREN_PAGES = 'subpages'
MDN_CHILDREN_TITLE = 'title'
MDN_CHILDREN_URL = 'url'
MDN_CHILDREN_RAW = 'raw'
MDN_CHILDREN_SECTION = 'section'

MDN_RAW_DESCRIPTION = 'Description'
MDN_RAW_EXAMPLE = 'Examples'
MDN_RAW_SYNTAX = 'Syntax'
MDN_RAW_BROWSER_COMPATIBILITY = 'Browser_compatibility'

OUT_TITLE = 'title'
OUT_SUB = 'sub'
OUT_DATA = 'data'
OUT_DESCRIPTION = 'desc'
OUT_SYNTAX = 'syn'
OUT_EXAMPLE = 'exam'
OUT_COMPATIBILITY = 'comp'

count_loops = 0
total_loops = 0

def signal_handler(signal, frame):
	print('\n\nCopyright 2016 DeepSpace Development\n------------------------------------------------')
	sys.exit(0)
signal.signal(signal.SIGINT, signal_handler)

def get(url, perc = ''):
	stdout.write(perc + 'GET: ' + url)
	stdout.flush()
	r = requests.get(url)
	if r.status_code == 200:
		print ' DONE'
	else:
		print ' ERROR'
	return r

def readChildren(arr_children):
	out = []
	global count_loops
	global total_loops
	if(count_loops == 0):
		total_loops = (json.dumps(arr_children)).count('"url":') - 1
	count_loops += 1

	for child in arr_children:
		arr_child = {}
		arr_child[OUT_TITLE] = child[MDN_CHILDREN_TITLE]

		arr_child[OUT_SUB] = readChildren(child[MDN_CHILDREN_PAGES])
		if(len(arr_child['sub']) == 0):
			del arr_child['sub']
			# already did 1 loop and ++ before reaching this statement
			percentage_str = str('%05.1f'%((count_loops - 2) / total_loops * 100)) + '%'
			data_dict = {}

			arr_child[OUT_DATA] = get(MDN_URL + child[MDN_CHILDREN_URL] + '?' + MDN_CHILDREN_RAW, '[' + percentage_str + '] ').text

		out.append(arr_child)

	return out


# excecute & write data to json
print '------------------------------------------------'
input = raw_input('Please select a mdn datatable to fetch:\n\n   1: HTML\n   2: CSS\n   3: JS\n   4: SVG\n   5: WebAPI\n   6: Events\n   7: Accessibility\n\nInput: ')

reference_url = \
	input == '1' and MDN_HTML_REFERENCE_URL or \
	input == '2' and MDN_CSS_REFERENCE_URL or \
	input == '3' and MDN_JS_REFERENCE_URL or \
	input == '4' and MDN_SVG_REFERENCE_URL or \
	input == '5' and MDN_WEB_API_REFERENCE_URL or	\
	input == '6' and MDN_EVENTS_REFERENCE_URL or \
	input == '7' and MDN_ACCESSIBILITY_REFERENCE_URL or None

output_file = \
	input == '1' and 'HTML' or \
	input == '2' and 'CSS' or \
	input == '3' and 'JS' or \
	input == '4' and 'SVG' or \
	input == '5' and 'WebAPI' or	\
	input == '6' and 'Events' or \
	input == '7' and 'Accessibility' or None

if(reference_url != None):
	print '\nCRAWLER started, ' + output_file + ' selected.\n'
	data = (get(reference_url + MDN_CHILDREN_PARAMETER).json())[MDN_CHILDREN_PAGES]
	#data = (get('https://developer.mozilla.org//en-US/docs/Web/JavaScript/Reference/Functions$children').json())[MDN_CHILDREN_PAGES]
	with open(output_file + '.json', 'w') as outfile:
	    json.dump(readChildren(data), outfile)
	print "\nDONE: Output saved to " + output_file + ".json"
else:
	print "Invalid input"
print('\nCopyright 2016 DeepSpace Development\n------------------------------------------------')