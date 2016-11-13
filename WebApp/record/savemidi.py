import cgi
form = cgi.FieldStorage()
print form["targetFile"]
