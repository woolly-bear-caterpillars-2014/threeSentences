class Story < ActiveRecord::Base
  belongs_to :user
  has_many :sentences

  validates :name, presence: true


  def export_story(filetype)
    self.export(get_content, filetype)
  end

  def get_content
    md_content = ""
    md_content += create_title

    headers = get_headers
    headers.each do |header|
      md_content += create_header(header)
      md_content += get_children(header)
      md_content += "\n"
    end
    md_content
  end

  def get_children(parent)
      child_content = ""
     if parent.children.exists?
      parent.children.each do |child|
         child_content += create_text(child)
         if child.children.exists?
          child_content += "\n"
          child_content += get_children(child)
          child_content += "\n"
         end
      end
    end
    child_content
  end


  def get_headers
    [1, 2, 3].map {|position| self.sentences.find_by_position(position)}
  end

  # def depth_start_position(depth)
  #   position = 1
  #   depth.times do |i|
  #     position += 3 ** (i + 1)
  #   end
  #   position
  # end

  # def depth_end_position(depth)
  #   depth_start_position(depth) + 3 ** (depth + 1) - 1
  # end

  def create_title
    "# #{self.name}\n\n"
  end

  def create_header(header, level = 2)
    "#{'#' * level} #{header.content}\n\n"
  end

  def create_text(child)
    punct = %w(. : ? ! ;)
    child.content += "." unless punct.include?(child.content[-1])
    level = case child.depth
                when 1 then '### '
                when 2 then '> '
                when 3 then '>> '
                when 4 then '>>> '
                end
    "#{level}#{child.content}\n"
  end

  def export(content, filetype)
    filename = downcase_and_change_spaces_to_underscores(self.name)
    case filetype
    when 'rtf'
      to_export = Docverter::Conversion.run("markdown", filetype, content)
      File.open("tmp/#{filename}.#{filetype}", 'w') { |file| file.write(to_export) }
    when 'pdf'
      to_export = Docverter::Conversion.run("markdown", filetype, content)
      File.open("tmp/#{filename}.#{filetype}", 'wb') { |file| file.write(to_export) }
    when 'md'
      File.open("tmp/#{filename}.#{filetype}", 'w') { |file| file.write(content) }
    end
    return "/download/#{filename}.#{filetype}"
  end

  def downcase_and_change_spaces_to_underscores(name)
    name.squish.downcase.tr(" ","_")
  end

end
