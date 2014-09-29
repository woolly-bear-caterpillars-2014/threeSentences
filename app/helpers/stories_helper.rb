module StoriesHelper
  def story_controls
    if ( params['controller'] == 'stories' &&
       ( params['action'] == 'show' ||
	 params['action'] == 'share' || params['action'] == 'demo') )
      render :partial => 'stories/story_nav'
    end
  end
end
