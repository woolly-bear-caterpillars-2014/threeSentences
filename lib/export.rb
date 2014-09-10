module Export

  def export_story(filetype)
    @sentences = self.sentences
    self.export(get_content, filetype)
  end

  def get_content
    md_content = ""
    md_content += create_title

    headers = get_headers
    headers.each do |header|
      md_content += create_header(header)
      md_content += add_children(header)
      md_content += "\n"
    end
    md_content
  end

  def add_children(parent)
    child_content = ""
    if has_children?(parent)
      get_children(parent).each do |child|
         child_content += create_text(child)
         if has_children?(child)
          child_content += "\n"
          child_content += add_children(child)
          child_content += "\n"
         end
      end
    end
    child_content
  end

  def has_children?(parent)
    get_children(parent).length > 0
  end

  def get_children(parent)
    @sentences.select { |sentence| sentence.parent_id == parent.id }
  end

  def get_headers
    @sentences.select { |sentence| [1, 2, 3].include? (sentence.position) }
  end

  def create_title
    "# #{self.name}\n\n"
  end

  def create_header(header, level = 2)
    "#{'#' * level} #{punctuate(header).content}\n\n"
  end

  def create_text(child)
    level = case child.depth
                when 1 then '### '
                when 2 then '> '
                when 3 then '>> '
                when 4 then '>>> '
                end
    "#{level}#{punctuate(child).content}\n"
  end

  def punctuate(sentence)
    punct = %w(. : ? ! ;)
    sentence.content += "." unless punct.include?(sentence.content[-1])
    sentence
  end

  def export(content, filetype)
    filename = prepare_story_title_for_export(self.name)
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

  def prepare_story_title_for_export(name)
    name.squish.downcase.tr(" ","_").gsub(/[^\w\.]/, '')[0..19]
  end


end
