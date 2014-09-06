class Story < ActiveRecord::Base
  belongs_to :user
  has_many :sentences

  validates :name, presence: true

  def export
    self.generate_markdown('args')
  end

  def generate_markdown(args)
    depth = args[:depth]
    filetype = args[:type]
    md_content = ""
    md_content += create_title

    # sentences = self.sentences

    # sentences.each do |sentence|
    #   if sentence.depth == depth - 1

    #   elsif sentence.depth == depth

    #   end
    # end

    first_parent = self.sentences.where(parent_id: nil, position: 1)
    second_parent = self.sentences.where(parent_id: nil, position: 2)
    third_parent = self.sentences.where(parent_id: nil, position: 3)

    if depth == 0
      create_header(first_parent)
      create_header(second_parent)
      create_header(third_parent)
    else
      first_parent.children.each do |child|
        if child.depth == depth
          # do
        end
      end
      second_parent
      third_parent
    end



    # parents.each do |parent|
    #   md_content += create_header(parent)
    #   parent.children.each do |child|
    #     md_content += create_text(child)
    #   end
    # end

    self.export(md_content, filetype)
  end

  def create_title
    "# #{self.name}\n\n"
  end

  def create_header(parent, level = 2)
    "#{'#' * level} #{parent.content}\n\n"
  end

  def create_text(child)
    "#{child.content}\n"
  end


  def export(content, filetype)
    Docverter::Conversion.run("markdown", filetype, content)
  end
end
