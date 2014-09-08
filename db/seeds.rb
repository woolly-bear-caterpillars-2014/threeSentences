require 'faker'
# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)
# User.create(email: "author.gmail.com")
Story.create(name: "My First Story", user_id: "1")

# create 3 parentless sentences
def make_three(sid, d, pid = nil, position = 0)
  Sentence.create(parent_id: pid, story_id: sid, depth: d, content: "#{Faker::Hacker.say_something_smart}", position: position + 1)
  Sentence.create(parent_id: pid, story_id: sid, depth: d, content: "#{Faker::Hacker.say_something_smart}", position: position + 2)
  Sentence.create(parent_id: pid, story_id: sid, depth: d, content: "#{Faker::Hacker.say_something_smart}", position: position + 3)
end

make_three(1, 0)

depth1 = [1, 2, 3]

depth1.each do |d|
  sentence = Sentence.find(d)
  make_three(sentence.story_id, (sentence.depth + 1), sentence.id, Sentence.last.position)
end

depth2 = [4, 5, 6, 7, 8, 9, 10, 11, 12]

depth2.each do |d|
  sentence = Sentence.find(d)
  make_three(sentence.story_id, (sentence.depth + 1), sentence.id, Sentence.last.position)
end

depth3 = (13..39).to_a

depth3.each do |d|
  sentence = Sentence.find(d)
  make_three(sentence.story_id, (sentence.depth + 1), sentence.id, Sentence.last.position)
end

depth4 = (40..120).to_a

depth4.each do |d|
  sentence = Sentence.find(d)
  make_three(sentence.story_id, (sentence.depth + 1), sentence.id, Sentence.last.position)
end

# depth5 = (121..363).to_a

# depth5.each do |d|
#   sentence = Sentence.find(d)
#   make_three(sentence.story_id, (sentence.depth + 1), sentence.id, Sentence.last.position)
# end

