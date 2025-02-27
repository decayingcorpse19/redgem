#main.rb server

require 'sinatra'

#html viewer for login page 

get '/' do 
send_file 'signup.html'
end

get '/' do
  html :signup
end
