To start your project from base.git

    git clone git@github.com:FamousInternal/base.git path/to/folder
    cd path/to/folder
    git submodule update --remote --init --recursive

Then to push to your own repository, create the repository (on GitHub) at `git@github.com:your.url.here`

    git remote set-url origin git@github.com:your.url.here
    
