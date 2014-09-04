# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)
# User.create(email: "author.gmail.com")
Story.create(name: "My First Story", user_id: "1")

depth = [2, 3, 4, 5, 6]

# create 3 parentless sentences
def make_three(sid, d, pid = nil)
  Sentence.create(parent_id: pid, story_id: sid, depth: d, content: "one")
  Sentence.create(parent_id: pid, story_id: sid, depth: d, content: "two")
  Sentence.create(parent_id: pid, story_id: sid, depth: d, content: "three")
end

# new parent id = depth ** 3 + 1

make_three(1, 1)

Sentence.all.each do |sentence|
  a = sentence.children.create
  b = sentence.children.create
  c = sentence.children.create
  a.story_id = sentence.story_id
  a.depth = (sentence.depth + 1)
  a.content = "one"
  a.position = 1
  b.story_id = sentence.story_id
  b.depth = (sentence.depth + 1)
  b.content = "two"
  b.position = 2
  c.story_id = sentence.story_id
  c.depth = (sentence.depth + 1)
  c.content = "three"
  c.position = 3
  a.save
  b.save
  c.save
end

depth2 = [4, 5, 6, 7, 8, 9, 10, 11, 12]

depth2.each do |sentence|
  a = Sentence.find(sentence).children.create
  b = Sentence.find(sentence).children.create
  c = Sentence.find(sentence).children.create
  a.story_id = 1
  a.depth = (3)
  a.content = "one"
  a.position = 1
  b.story_id = 1
  b.depth = (3)
  b.content = "two"
  b.position = 2
  c.story_id = 1
  c.depth = (3)
  c.content = "three"
  c.position = 3
  a.save
  b.save
  c.save
end
